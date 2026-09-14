<?php
declare(strict_types=1);

/*
 * POST /api/auth/request.php  {"email": "..."}
 *
 * Emails a one-time sign-in link. Only the SHA-256 of the token is stored, so
 * the database never holds anything that can be used to sign in.
 *
 * Always answers "ok" for any syntactically valid address, whether or not an
 * account exists, so this cannot be used to test which emails are registered.
 */

require_once __DIR__ . '/../_lib.php';
require_once __DIR__ . '/../_ratelimit.php';

require_method('POST');
rate_limit_or_exit('auth_request', 5, 900);   // 5 link requests / 15 min / IP
sweep_expired();

$email = filter_var(trim((string) (body()['email'] ?? '')), FILTER_VALIDATE_EMAIL);
if (!$email) {
    fail(422, 'bad_email', 'Enter a valid email address.');
}
$email = mb_strtolower($email);
if (mb_strlen($email) > 255) {
    fail(422, 'bad_email', 'That email address is too long.');
}

$token = bin2hex(random_bytes(32));
$hash  = hash('sha256', $token);

// Expiry computed by MySQL - see the note in _lib.php start_session_for().
db()->prepare(
    'INSERT INTO login_tokens (email, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))'
)->execute([$email, $hash, TOKEN_MINUTES]);

$link = site_origin() . '/api/auth/verify.php?token=' . $token;

$subject = 'Your SeedBay sign-in link';
$message = "Hello,\r\n\r\n"
    . "Here is your sign-in link for SeedBay. It works once and expires in "
    . TOKEN_MINUTES . " minutes:\r\n\r\n"
    . $link . "\r\n\r\n"
    . "If you did not ask to sign in, you can ignore this email - nobody can "
    . "use the link without it.\r\n\r\n"
    . "SeedBay.co.uk\r\n";

$host    = parse_url(site_origin(), PHP_URL_HOST) ?: 'seedbay.co.uk';
$headers = [
    'From: SeedBay <noreply@' . $host . '>',
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: SeedBay',
];

// Best-effort: if the host's mailer is down we still return ok rather than
// telling a stranger anything about the account, but it is logged so a failure
// to deliver is diagnosable from the error log rather than invisible.
if (!@mail($email, $subject, $message, implode("\r\n", $headers))) {
    error_log('[seedbay] mail() failed for a sign-in link');
}

json_out(['ok' => true]);
