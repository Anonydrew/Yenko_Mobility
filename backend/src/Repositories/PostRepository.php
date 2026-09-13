<?php

declare(strict_types=1);

namespace Yenko\Repositories;

use PDO;
use Yenko\Support\Clock;
use Yenko\Support\Database;

final class PostRepository
{
    public const STATUSES = ['draft', 'published'];

    /** List views skip the body but keep its length for the reading-time estimate. */
    private const LIST_COLUMNS = 'p.id, p.title, p.slug, p.excerpt, p.cover_image, p.status, p.published_at,
        p.category_id, p.created_at, p.updated_at, LENGTH(p.body) AS body_length,
        c.name AS category_name, c.slug AS category_slug';

    private PDO $db;

    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::connection();
    }

    /**
     * @param array{publishedOnly?:bool,status?:?string,categoryId?:?int,search?:?string} $filters
     * @return array{0:list<array<string,mixed>>,1:int} [rows, total]
     */
    public function paginate(array $filters, int $limit, int $offset): array
    {
        [$where, $bindings] = $this->whereClause($filters);

        $count = $this->db->prepare("SELECT COUNT(*) FROM posts p {$where}");
        $count->execute($bindings);
        $total = (int) $count->fetchColumn();

        $order = empty($filters['publishedOnly']) ? 'p.updated_at DESC, p.id DESC' : 'p.published_at DESC, p.id DESC';
        $stmt = $this->db->prepare(
            'SELECT ' . self::LIST_COLUMNS . "
             FROM posts p JOIN categories c ON c.id = p.category_id
             {$where}
             ORDER BY {$order}
             LIMIT :limit OFFSET :offset"
        );
        foreach ($bindings as $name => $value) {
            $stmt->bindValue($name, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return [$stmt->fetchAll(), $total];
    }

    /** @return array<string,mixed>|null */
    public function find(int $id): ?array
    {
        return $this->fetchFull('p.id = :id', [':id' => $id]);
    }

    /** @return array<string,mixed>|null */
    public function findBySlug(string $slug, bool $publishedOnly): ?array
    {
        $condition = 'p.slug = :slug';
        $bindings = [':slug' => $slug];
        if ($publishedOnly) {
            $condition .= " AND p.status = 'published' AND p.published_at <= :now";
            $bindings[':now'] = Clock::now();
        }

        return $this->fetchFull($condition, $bindings);
    }

    public function slugTaken(string $slug, ?int $ignoreId = null): bool
    {
        $stmt = $this->db->prepare('SELECT 1 FROM posts WHERE slug = ? AND id <> ?');
        $stmt->execute([$slug, $ignoreId ?? 0]);

        return $stmt->fetchColumn() !== false;
    }

    /** @param array<string,mixed> $data Column values; created_at/updated_at default to now */
    public function create(array $data): int
    {
        $now = Clock::now();
        $this->db->prepare(
            'INSERT INTO posts (title, slug, excerpt, body, cover_image, status, published_at, category_id, created_at, updated_at)
             VALUES (:title, :slug, :excerpt, :body, :cover_image, :status, :published_at, :category_id, :created_at, :updated_at)'
        )->execute([
            ':title' => $data['title'],
            ':slug' => $data['slug'],
            ':excerpt' => $data['excerpt'],
            ':body' => $data['body'],
            ':cover_image' => $data['cover_image'],
            ':status' => $data['status'],
            ':published_at' => $data['published_at'],
            ':category_id' => $data['category_id'],
            ':created_at' => $data['created_at'] ?? $now,
            ':updated_at' => $data['updated_at'] ?? $now,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /** @param array<string,mixed> $data Column values */
    public function update(int $id, array $data): void
    {
        $this->db->prepare(
            'UPDATE posts SET title = :title, slug = :slug, excerpt = :excerpt, body = :body, cover_image = :cover_image,
                status = :status, published_at = :published_at, category_id = :category_id, updated_at = :updated_at
             WHERE id = :id'
        )->execute([
            ':title' => $data['title'],
            ':slug' => $data['slug'],
            ':excerpt' => $data['excerpt'],
            ':body' => $data['body'],
            ':cover_image' => $data['cover_image'],
            ':status' => $data['status'],
            ':published_at' => $data['published_at'],
            ':category_id' => $data['category_id'],
            ':updated_at' => Clock::now(),
            ':id' => $id,
        ]);
    }

    public function delete(int $id): void
    {
        $this->db->prepare('DELETE FROM posts WHERE id = ?')->execute([$id]);
    }

    /**
     * @param array<string,mixed> $row
     * @return array<string,mixed>
     */
    public static function toApi(array $row, bool $withBody = false): array
    {
        $bodyLength = isset($row['body']) ? mb_strlen((string) $row['body']) : (int) ($row['body_length'] ?? 0);

        $post = [
            'id' => (int) $row['id'],
            'title' => $row['title'],
            'slug' => $row['slug'],
            'excerpt' => $row['excerpt'],
            'coverImage' => $row['cover_image'],
            'status' => $row['status'],
            'publishedAt' => Clock::toIso($row['published_at']),
            'categoryId' => (int) $row['category_id'],
            'category' => [
                'id' => (int) $row['category_id'],
                'name' => $row['category_name'],
                'slug' => $row['category_slug'],
            ],
            'readingMinutes' => max(1, (int) round($bodyLength / 1100)),
            'createdAt' => Clock::toIso($row['created_at']),
            'updatedAt' => Clock::toIso($row['updated_at']),
        ];
        if ($withBody) {
            $post['body'] = $row['body'];
        }

        return $post;
    }

    /**
     * @param array<string,mixed> $filters
     * @return array{0:string,1:array<string,mixed>}
     */
    private function whereClause(array $filters): array
    {
        $conditions = [];
        $bindings = [];

        if (!empty($filters['publishedOnly'])) {
            $conditions[] = "p.status = 'published' AND p.published_at <= :now";
            $bindings[':now'] = Clock::now();
        } elseif (!empty($filters['status'])) {
            $conditions[] = 'p.status = :status';
            $bindings[':status'] = $filters['status'];
        }

        if (!empty($filters['categoryId'])) {
            $conditions[] = 'p.category_id = :categoryId';
            $bindings[':categoryId'] = (int) $filters['categoryId'];
        }

        if (!empty($filters['search'])) {
            // "!" as the LIKE escape character works the same in SQLite and MySQL.
            $like = '%' . strtr((string) $filters['search'], ['!' => '!!', '%' => '!%', '_' => '!_']) . '%';
            $conditions[] = "(p.title LIKE :searchTitle ESCAPE '!' OR p.excerpt LIKE :searchExcerpt ESCAPE '!')";
            $bindings[':searchTitle'] = $like;
            $bindings[':searchExcerpt'] = $like;
        }

        return [$conditions === [] ? '' : 'WHERE ' . implode(' AND ', $conditions), $bindings];
    }

    /**
     * @param array<string,mixed> $bindings
     * @return array<string,mixed>|null
     */
    private function fetchFull(string $condition, array $bindings): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM posts p JOIN categories c ON c.id = p.category_id
             WHERE {$condition}"
        );
        $stmt->execute($bindings);

        return $stmt->fetch() ?: null;
    }
}
