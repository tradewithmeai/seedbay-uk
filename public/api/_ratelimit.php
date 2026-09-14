<?php
declare(strict_types=1);

/*
 * Per-IP sliding-window rate limiter.
 *
 * File-based, kept in the system temp dir (NOT the web root, so the counters are
 * never downloadable). It FAILS OPEN: any error in the limiter is swallowed and
 * the request proceeds, so a limiter bug can never take the site down. On a
 * genuine limit it sends HTTP 429 and exits.
 */
function rate_limit_or_exit(string $bucket, int $max = 20, int $window = 60): void
{
    try {
        $ip  = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $key = hash('sha256', $ip . '|' . $bucket);   // IP is hashed, never stored raw
        $dir = sys_get_temp_dir() . '/seedbay-rl';
        if (!is_dir($dir)) {
            @mkdir($dir, 0700, true);
        }
        $file = $dir . '/' . $key . '.json';
        $now  = time();

        // Hold an exclusive lock across read -> check -> write, so concurrent
        // requests for the same IP cannot all read a stale count and overrun the
        // cap. 'c+' opens read/write and creates without truncating.
        $fh = @fopen($file, 'c+');
        if ($fh === false) {
            return;
        }
        try {
            if (!flock($fh, LOCK_EX)) {
                return;
            }
            $raw     = stream_get_contents($fh);
            $decoded = $raw ? json_decode($raw, true) : null;
            $hits    = is_array($decoded) ? $decoded : [];

            $hits = array_values(array_filter($hits, static function ($t) use ($now, $window) {
                return ($now - (int) $t) < $window;
            }));

            if (count($hits) >= $max) {
                flock($fh, LOCK_UN);
                fclose($fh);
                http_response_code(429);
                header('Retry-After: ' . $window);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'rate_limited', 'message' => 'Too many requests. Try again shortly.']);
                exit;
            }

            $hits[] = $now;
            rewind($fh);
            ftruncate($fh, 0);
            fwrite($fh, json_encode($hits));
            fflush($fh);
            flock($fh, LOCK_UN);
        } finally {
            fclose($fh);
        }
    } catch (\Throwable $e) {
        // Fail open.
    }
}
