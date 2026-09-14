<?php
declare(strict_types=1);

/*
 * GET  /api/seeds.php  - list live listings (public; also what the build reads
 *                        to pre-render every listing page).
 * POST /api/seeds.php  - create a listing (signed in).
 *
 * Filters on GET: title, category, location, free=1, limit.
 */

require_once __DIR__ . '/_lib.php';
require_once __DIR__ . '/_ratelimit.php';

// Mirrors EXPIRY_OPTIONS in src/components/SeedForm.tsx.
const ALLOWED_EXPIRY_DAYS = [30, 60, 90];

require_method('GET', 'POST');
sweep_expired();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    list_seeds();
}

create_seed();

function list_seeds(): void
{
    $sql    = 'SELECT * FROM seeds WHERE active = 1 AND (expires_at IS NULL OR expires_at > NOW())';
    $params = [];

    $title = clean($_GET['title'] ?? '', 200);
    if ($title !== '') {
        $sql .= ' AND (title LIKE ? OR variety LIKE ?)';
        $params[] = '%' . $title . '%';
        $params[] = '%' . $title . '%';
    }

    $category = clean($_GET['category'] ?? '', 40);
    if ($category !== '') {
        $sql .= ' AND category = ?';
        $params[] = $category;
    }

    $location = clean($_GET['location'] ?? '', 120);
    if ($location !== '') {
        $sql .= ' AND location LIKE ?';
        $params[] = '%' . $location . '%';
    }

    if (($_GET['free'] ?? '') === '1') {
        $sql .= ' AND is_free = 1';
    }

    // Interpolated, not bound: MySQL will not take a placeholder in LIMIT under
    // real prepared statements. Forced to an int in a fixed range first.
    $limit = (int) ($_GET['limit'] ?? 500);
    $limit = max(1, min($limit, 1000));
    $sql  .= ' ORDER BY created_at DESC LIMIT ' . $limit;

    $stmt = db()->prepare($sql);
    $stmt->execute($params);

    json_out(['seeds' => array_map('seed_row', $stmt->fetchAll())]);
}

function create_seed(): void
{
    rate_limit_or_exit('post_seed', 10, 3600);   // 10 listings / hour / IP

    $user = require_user();
    $in   = body();

    $title       = clean($in['title'] ?? '', 200);
    $description = clean($in['description'] ?? '', 4000);
    $contact     = clean($in['contact_value'] ?? '', 255);

    $allowedCategories = ['Vegetable', 'Flower', 'Herb', 'Fruit', 'Tree / Shrub', 'Other'];
    $category = clean($in['category'] ?? '', 40);
    if (!in_array($category, $allowedCategories, true)) {
        $category = 'Other';
    }

    // Must match CONTACT_METHODS in src/components/SeedForm.tsx, or a method the
    // form offers gets silently rewritten to Email on save.
    $allowedContact = ['Email', 'WhatsApp', 'Signal', 'Other'];
    $contactMethod = clean($in['contact_method'] ?? '', 20);
    if (!in_array($contactMethod, $allowedContact, true)) {
        $contactMethod = 'Email';
    }

    if ($title === '' || $description === '' || $contact === '') {
        fail(422, 'missing_fields', 'Title, description and a contact are all required.');
    }
    if ($contactMethod === 'Email' && !filter_var($contact, FILTER_VALIDATE_EMAIL)) {
        fail(422, 'bad_contact', 'That does not look like an email address.');
    }

    $isFree = !empty($in['is_free']);
    $price  = $isFree ? null : (clean($in['price'] ?? '', 40) ?: null);

    $id = uuid4();

    // Expiry is the poster's choice, from a fixed set the form offers. Anything
    // else (including "never") stores NULL, which list_seeds() treats as live
    // forever. Computed by MySQL - see the note in _lib.php start_session_for().
    $expiryDays = (int) ($in['expiry_days'] ?? 0);
    $expiry     = in_array($expiryDays, ALLOWED_EXPIRY_DAYS, true) ? $expiryDays : null;

    $sql = $expiry === null
        ? 'INSERT INTO seeds
             (id, user_id, title, variety, category, quantity, description,
              is_free, price, contact_method, contact_value, location, expires_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)'
        : 'INSERT INTO seeds
             (id, user_id, title, variety, category, quantity, description,
              is_free, price, contact_method, contact_value, location, expires_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))';

    $args = [
        $id,
        $user['id'],
        $title,
        clean($in['variety'] ?? '', 200) ?: null,
        $category,
        clean($in['quantity'] ?? '', 100) ?: null,
        $description,
        $isFree ? 1 : 0,
        $price,
        $contactMethod,
        $contact,
        clean($in['location'] ?? '', 120) ?: null,
    ];
    if ($expiry !== null) {
        $args[] = $expiry;
    }

    db()->prepare($sql)->execute($args);

    json_out(['id' => $id], 201);
}
