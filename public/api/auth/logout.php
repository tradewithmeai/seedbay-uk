<?php
declare(strict_types=1);

// POST /api/auth/logout.php - drop the session server-side and clear the cookie.

require_once __DIR__ . '/../_lib.php';

require_method('POST');

end_session();

json_out(['ok' => true]);
