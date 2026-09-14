<?php
declare(strict_types=1);

/*
 * Shared plumbing for the SeedBay API.
 *
 * Credentials live in seedbay-secrets.php, which must sit OUTSIDE public_html
 * (one level above it). Nothing under the web root ever contains the database
 * password, so a PHP misconfiguration that serves .php files as plain text
 * cannot leak it. See API_SETUP.md.
 */

// Everything - PHP, the database connection, and every timestamp served to the
// frontend - is pinned to UTC. Shared hosting sets PHP and MySQL to whatever it
// likes, and a one-hour disagreement between them silently expires rows on
// write and mislabels every "Posted" date by an hour.
date_default_timezone_set('UTC');

const SESSION_COOKIE = 'seedbay_session';
const SESSION_DAYS   = 60;
const TOKEN_MINUTES  = 30;

function secrets(): array
{
    static $secrets = null;
    if ($secrets !== null) {
        return $secrets;
    }

    // public_html/api/_lib.php -> public_html/api -> public_html -> home
    $path = dirname(__DIR__, 2) . '/seedbay-secrets.php';
    if (!is_readable($path)) {
        fail(500, 'server_misconfigured', 'API secrets file is missing.');
    }

    $secrets = require $path;
    if (!is_array($secrets) || !isset($secrets['db_name'], $secrets['db_user'], $secrets['app_key'])) {
        fail(500, 'server_misconfigured', 'API secrets file is incomplete.');
    }
    return $secrets;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $s   = secrets();
    $dsn = 'mysql:host=' . ($s['db_host'] ?? 'localhost') . ';dbname=' . $s['db_name'] . ';charset=utf8mb4';

    try {
        $pdo = new PDO($dsn, $s['db_user'], $s['db_pass'] ?? '', [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        $pdo->exec("SET time_zone = '+00:00'");
    } catch (PDOException $e) {
        error_log('[seedbay] db connect failed: ' . $e->getMessage());
        fail(500, 'db_unavailable', 'Could not reach the database.');
    }

    return $pdo;
}

function json_out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $code, string $message): void
{
    json_out(['error' => $code, 'message' => $message], $status);
}

function require_method(string ...$allowed): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method === 'OPTIONS') {
        header('Allow: ' . implode(', ', $allowed));
        http_response_code(204);
        exit;
    }
    if (!in_array($method, $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        fail(405, 'method_not_allowed', 'Use ' . implode(' or ', $allowed) . '.');
    }
}

function body(): array
{
    $raw  = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** Trim, strip tags and clamp a user-supplied string. */
function clean($value, int $max): string
{
    $value = is_string($value) ? $value : '';
    $value = trim(strip_tags($value));
    if (mb_strlen($value) > $max) {
        $value = mb_substr($value, 0, $max);
    }
    return $value;
}

function uuid4(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
}

function site_origin(): string
{
    $s = secrets();
    return rtrim($s['site_origin'] ?? 'https://seedbay.co.uk', '/');
}

// --- sessions ---------------------------------------------------------------

function start_session_for(int $userId): string
{
    $id = bin2hex(random_bytes(32));

    // Expiry is computed by MySQL, not PHP. The two clocks are not necessarily
    // in the same timezone on shared hosting - PHP defaulting to UTC while the
    // database runs local time silently expires every row the moment it is
    // written. Everything compared against NOW() must therefore be built by NOW().
    db()->prepare(
        'INSERT INTO sessions (id, user_id, expires_at)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))'
    )->execute([$id, $userId, SESSION_DAYS]);

    setcookie(SESSION_COOKIE, $id, [
        'expires'  => time() + SESSION_DAYS * 86400,
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,   // the browser never needs to read this, so JS cannot either
        'samesite' => 'Lax',
    ]);

    return $id;
}

/** The signed-in user, or null. Expired sessions are treated as absent. */
function current_user(): ?array
{
    $id = $_COOKIE[SESSION_COOKIE] ?? '';
    if (!is_string($id) || !preg_match('/^[a-f0-9]{64}$/', $id)) {
        return null;
    }

    $stmt = db()->prepare(
        'SELECT u.id, u.email
           FROM sessions s
           JOIN users u ON u.id = s.user_id
          WHERE s.id = ? AND s.expires_at > NOW()'
    );
    $stmt->execute([$id]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function require_user(): array
{
    $user = current_user();
    if (!$user) {
        fail(401, 'not_signed_in', 'Sign in to do that.');
    }
    return $user;
}

function end_session(): void
{
    $id = $_COOKIE[SESSION_COOKIE] ?? '';
    if (is_string($id) && preg_match('/^[a-f0-9]{64}$/', $id)) {
        db()->prepare('DELETE FROM sessions WHERE id = ?')->execute([$id]);
    }
    setcookie(SESSION_COOKIE, '', [
        'expires'  => time() - 3600,
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

/*
 * Opportunistic cleanup of expired tokens and sessions. Shared hosting has no
 * cron worth relying on, so this piggybacks on real traffic - cheap, indexed,
 * and only runs on roughly 1 request in 50.
 */
function sweep_expired(): void
{
    if (random_int(1, 50) !== 1) {
        return;
    }
    try {
        db()->exec('DELETE FROM sessions WHERE expires_at < NOW()');
        db()->exec('DELETE FROM login_tokens WHERE expires_at < NOW()');
    } catch (Throwable $e) {
        error_log('[seedbay] sweep failed: ' . $e->getMessage());
    }
}

// --- serialisation ----------------------------------------------------------

/** Shape a DB row into the JSON the frontend expects. */
function seed_row(array $row): array
{
    return [
        'id'             => $row['id'],
        'user_id'        => $row['user_id'] !== null ? (int) $row['user_id'] : null,
        'title'          => $row['title'],
        'variety'        => $row['variety'],
        'category'       => $row['category'],
        'quantity'       => $row['quantity'],
        'description'    => $row['description'],
        'is_free'        => (bool) $row['is_free'],
        'price'          => $row['price'],
        'contact_method' => $row['contact_method'],
        'contact_value'  => $row['contact_value'],
        'location'       => $row['location'],
        'image'          => $row['image'],
        'created_at'     => gmdate('c', strtotime((string) $row['created_at'])),
        'expires_at'     => $row['expires_at'] ? gmdate('c', strtotime((string) $row['expires_at'])) : null,
        'active'         => (bool) $row['active'],
    ];
}
