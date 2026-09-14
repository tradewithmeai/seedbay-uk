<?php
declare(strict_types=1);

/*
 * POST /api/suggestions.php - the feedback form on /suggestions/.
 *
 * Write-only over HTTP: there is no GET, so the anon path can never read other
 * people's feedback back out.
 */

require_once __DIR__ . '/_lib.php';
require_once __DIR__ . '/_ratelimit.php';

require_method('POST');
rate_limit_or_exit('suggestion', 8, 3600);   // 8 / hour / IP

$in = body();

// Honeypot: real users never see or fill "company". Accept silently so a bot
// gets no signal, but store nothing.
if (!empty($in['company'])) {
    json_out(['ok' => true]);
}

$message = clean($in['message'] ?? '', 4000);
if ($message === '') {
    fail(422, 'missing_message', 'Write something first.');
}

// Must match FeedbackType in src/app/suggestions/page.tsx.
$allowedTypes = ['positive', 'constructive'];
$type = clean($in['feedback_type'] ?? '', 40);
if (!in_array($type, $allowedTypes, true)) {
    $type = 'constructive';
}

db()->prepare('INSERT INTO suggestions (name, feedback_type, message) VALUES (?, ?, ?)')
    ->execute([clean($in['name'] ?? '', 200) ?: null, $type, $message]);

json_out(['ok' => true], 201);
