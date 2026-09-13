<?php

declare(strict_types=1);

namespace Yenko\Repositories;

use PDO;
use Yenko\Support\Clock;
use Yenko\Support\Database;

final class ContactRepository
{
    public const TOPICS = ['general', 'support', 'partnerships', 'careers', 'press', 'waitlist'];

    private PDO $db;

    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::connection();
    }

    /** @param array{name:string,email:string,topic:string,campus:?string,message:string} $data */
    public function create(array $data): int
    {
        $this->db->prepare(
            'INSERT INTO contact_submissions (name, email, topic, campus, message, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([$data['name'], $data['email'], $data['topic'], $data['campus'], $data['message'], Clock::now()]);

        return (int) $this->db->lastInsertId();
    }

    /** @return array{0:list<array<string,mixed>>,1:int} [rows, total] */
    public function paginate(?string $topic, int $limit, int $offset): array
    {
        $where = $topic !== null ? 'WHERE topic = :topic' : '';
        $bindings = $topic !== null ? [':topic' => $topic] : [];

        $count = $this->db->prepare("SELECT COUNT(*) FROM contact_submissions {$where}");
        $count->execute($bindings);

        $stmt = $this->db->prepare(
            "SELECT id, name, email, topic, campus, message, created_at FROM contact_submissions {$where}
             ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset"
        );
        foreach ($bindings as $name => $value) {
            $stmt->bindValue($name, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return [$stmt->fetchAll(), (int) $count->fetchColumn()];
    }

    /**
     * @param array<string,mixed> $row
     * @return array<string,mixed>
     */
    public static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'topic' => $row['topic'],
            'campus' => $row['campus'],
            'message' => $row['message'],
            'createdAt' => Clock::toIso($row['created_at']),
        ];
    }
}
