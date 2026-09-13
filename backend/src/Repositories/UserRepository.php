<?php

declare(strict_types=1);

namespace Yenko\Repositories;

use PDO;
use Yenko\Support\Clock;
use Yenko\Support\Database;

final class UserRepository
{
    private PDO $db;

    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::connection();
    }

    /** @return array<string,mixed>|null */
    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT id, email, password_hash, created_at FROM admin_users WHERE id = ?');
        $stmt->execute([$id]);

        return $stmt->fetch() ?: null;
    }

    /** @return array<string,mixed>|null */
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT id, email, password_hash, created_at FROM admin_users WHERE email = ?');
        $stmt->execute([strtolower(trim($email))]);

        return $stmt->fetch() ?: null;
    }

    /**
     * There is exactly one admin. Re-seeding updates its email and password from .env.
     *
     * @return 'created'|'updated'
     */
    public function upsertAdmin(string $email, string $passwordHash): string
    {
        $existingId = $this->db->query('SELECT id FROM admin_users ORDER BY id LIMIT 1')->fetchColumn();

        if ($existingId !== false) {
            $this->db
                ->prepare('UPDATE admin_users SET email = ?, password_hash = ? WHERE id = ?')
                ->execute([$email, $passwordHash, $existingId]);
            $this->db->prepare('DELETE FROM admin_users WHERE id <> ?')->execute([$existingId]);

            return 'updated';
        }

        $this->db
            ->prepare('INSERT INTO admin_users (email, password_hash, created_at) VALUES (?, ?, ?)')
            ->execute([$email, $passwordHash, Clock::now()]);

        return 'created';
    }

    public function updatePasswordHash(int $id, string $passwordHash): void
    {
        $this->db->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')->execute([$passwordHash, $id]);
    }

    /**
     * @param array<string,mixed> $row
     * @return array<string,mixed>
     */
    public static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'email' => $row['email'],
            'createdAt' => Clock::toIso($row['created_at']),
        ];
    }
}
