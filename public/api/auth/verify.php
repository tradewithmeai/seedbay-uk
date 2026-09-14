<?php
declare(strict_types=1);

/*
 * GET /api/auth/verify.php?token=...
 *
 * Consumes a magic-link token, creates the account on first sign-in, starts a
 * session and redirects into the site. Redirects (rather than returning JSON)
 * because this URL is opened straight from an email client.
 */

require_once __DIR__ . '/../_lib.php';
require_once __DIR__ . '/../_ratelimit.php';

require_method('GET');
rate_limit_or_exit('auth_verify', 20, 900);

function bounce(string $path): void
{
    header('Location: ' . site_origin() . $path, true, 302);
    exit;
}

$token = (string) ($_GET['token'] ?? '');
if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
    bounce('/login/?error=invalid');
}

$hash = hash('sha256', $token);
$pdo  = db();

$pdo->beginTransaction();
try {
    // Lock the row for the life of the transaction so the same link opened twice
    // at once (email scanners love doing this) cannot mint two sessions.
    $stmt = $pdo->prepare(
        'SELECT id, email FROM login_tokens
          WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
          FOR UPDATE'
    );
    $stmt->execute([$hash]);
    $row = $stmt->fetch();

    if (!$row) {
        $pdo->rollBack();
        bounce('/login/?error=expired');
    }

    $pdo->prepare('UPDATE login_tokens SET used_at = NOW() WHERE id = ?')->execute([$row['id']]);

    $email = $row['email'];
    $find  = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $find->execute([$email]);
    $user = $find->fetch();

    if ($user) {
        $userId = (int) $user['id'];
        $pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$userId]);
    } else {
        $pdo->prepare('INSERT INTO users (email, last_login_at) VALUES (?, NOW())')->execute([$email]);
        $userId = (int) $pdo->lastInsertId();
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('[seedbay] verify failed: ' . $e->getMessage());
    bounce('/login/?error=server');
}

start_session_for($userId);
bounce('/post/');
