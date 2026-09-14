<?php
declare(strict_types=1);

// GET /api/auth/me.php - who is signed in, if anyone.

require_once __DIR__ . '/../_lib.php';

require_method('GET');

// The session cookie makes every response user-specific; never let a proxy or
// the browser cache one and hand it to somebody else.
header('Cache-Control: no-store, private');

$user = current_user();

json_out(['user' => $user ? ['id' => (int) $user['id'], 'email' => $user['email']] : null]);
