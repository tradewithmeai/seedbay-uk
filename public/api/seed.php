<?php
declare(strict_types=1);

/*
 * GET /api/seed.php?id=<uuid> - one listing.
 *
 * Used by the legacy /view?id= redirector, which needs to resolve an id to its
 * slug. Inactive and expired listings return 404 so old links do not resurrect
 * a listing the owner has taken down.
 */

require_once __DIR__ . '/_lib.php';

require_method('GET');

$id = (string) ($_GET['id'] ?? '');
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
    fail(400, 'bad_id', 'Not a valid listing id.');
}

$stmt = db()->prepare(
    'SELECT * FROM seeds
      WHERE id = ? AND active = 1 AND (expires_at IS NULL OR expires_at > NOW())'
);
$stmt->execute([$id]);
$row = $stmt->fetch();

if (!$row) {
    fail(404, 'not_found', 'That listing has expired or been removed.');
}

json_out(['seed' => seed_row($row)]);
