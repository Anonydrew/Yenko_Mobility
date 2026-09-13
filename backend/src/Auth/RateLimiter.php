<?php

declare(strict_types=1);

namespace Yenko\Auth;

use PDO;
use Yenko\Support\Clock;
use Yenko\Support\Config;
use Yenko\Support\Database;

/** Fixed-window limiter backed by the rate_limit_hits table. Keys (IPs) are stored hashed. */
final class RateLimiter
{
    private PDO $db;

    public function __construct(
        private readonly string $bucket,
        private readonly int $maxHits,
        private readonly int $windowSeconds,
        ?PDO $db = null,
    ) {
        $this->db = $db ?? Database::connection();
    }

    public function tooMany(string $key): bool
    {
        $cutoff = gmdate(Clock::DB_FORMAT, time() - $this->windowSeconds);

        $this->db
            ->prepare('DELETE FROM rate_limit_hits WHERE bucket = ? AND created_at < ?')
            ->execute([$this->bucket, $cutoff]);

        $stmt = $this->db->prepare('SELECT COUNT(*) FROM rate_limit_hits WHERE bucket = ? AND key_hash = ?');
        $stmt->execute([$this->bucket, $this->hash($key)]);

        return (int) $stmt->fetchColumn() >= $this->maxHits;
    }

    public function hit(string $key): void
    {
        $this->db
            ->prepare('INSERT INTO rate_limit_hits (bucket, key_hash, created_at) VALUES (?, ?, ?)')
            ->execute([$this->bucket, $this->hash($key), Clock::now()]);
    }

    public function clear(string $key): void
    {
        $this->db
            ->prepare('DELETE FROM rate_limit_hits WHERE bucket = ? AND key_hash = ?')
            ->execute([$this->bucket, $this->hash($key)]);
    }

    private function hash(string $key): string
    {
        return hash_hmac('sha256', $this->bucket . '|' . $key, Config::get('JWT_SECRET', 'yenko') ?? 'yenko');
    }
}
