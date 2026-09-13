<?php

declare(strict_types=1);

namespace Yenko\Repositories;

use PDO;
use Yenko\Support\Clock;
use Yenko\Support\Database;

final class CategoryRepository
{
    private PDO $db;

    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::connection();
    }

    /**
     * Categories with post counts. Public counts include only posts that are published and live.
     *
     * @return list<array<string,mixed>>
     */
    public function allWithCounts(bool $publicCounts): array
    {
        $join = 'LEFT JOIN posts p ON p.category_id = c.id';
        $bindings = [];
        if ($publicCounts) {
            $join .= " AND p.status = 'published' AND p.published_at <= :now";
            $bindings[':now'] = Clock::now();
        }

        $stmt = $this->db->prepare(
            "SELECT c.id, c.name, c.slug, c.description, COUNT(p.id) AS post_count
             FROM categories c {$join}
             GROUP BY c.id, c.name, c.slug, c.description
             ORDER BY c.name"
        );
        $stmt->execute($bindings);

        return $stmt->fetchAll();
    }

    /** @return array<string,mixed>|null */
    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT id, name, slug, description FROM categories WHERE id = ?');
        $stmt->execute([$id]);

        return $stmt->fetch() ?: null;
    }

    /** @return array<string,mixed>|null */
    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare('SELECT id, name, slug, description FROM categories WHERE slug = ?');
        $stmt->execute([$slug]);

        return $stmt->fetch() ?: null;
    }

    public function nameTaken(string $name, ?int $ignoreId = null): bool
    {
        $stmt = $this->db->prepare('SELECT 1 FROM categories WHERE LOWER(name) = LOWER(?) AND id <> ?');
        $stmt->execute([$name, $ignoreId ?? 0]);

        return $stmt->fetchColumn() !== false;
    }

    public function slugTaken(string $slug, ?int $ignoreId = null): bool
    {
        $stmt = $this->db->prepare('SELECT 1 FROM categories WHERE slug = ? AND id <> ?');
        $stmt->execute([$slug, $ignoreId ?? 0]);

        return $stmt->fetchColumn() !== false;
    }

    public function create(string $name, string $slug, ?string $description): int
    {
        $this->db
            ->prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)')
            ->execute([$name, $slug, $description]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, string $name, string $slug, ?string $description): void
    {
        $this->db
            ->prepare('UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?')
            ->execute([$name, $slug, $description, $id]);
    }

    public function delete(int $id): void
    {
        $this->db->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);
    }

    public function postCount(int $id): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM posts WHERE category_id = ?');
        $stmt->execute([$id]);

        return (int) $stmt->fetchColumn();
    }

    /**
     * @param array<string,mixed> $row
     * @return array<string,mixed>
     */
    public static function toApi(array $row): array
    {
        $category = [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'slug' => $row['slug'],
            'description' => $row['description'],
        ];
        if (array_key_exists('post_count', $row)) {
            $category['postCount'] = (int) $row['post_count'];
        }

        return $category;
    }
}
