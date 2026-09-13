<?php

declare(strict_types=1);

namespace Yenko\Repositories;

use JsonException;
use PDO;
use Yenko\Support\Clock;
use Yenko\Support\Database;

/** Key/value store for editable site content, such as the pricing configuration. Values are JSON documents. */
final class SettingsRepository
{
    private PDO $db;

    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? Database::connection();
    }

    /** @return array{value:array<string,mixed>,updated_at:string}|null */
    public function get(string $key): ?array
    {
        $stmt = $this->db->prepare('SELECT value, updated_at FROM site_settings WHERE setting_key = ?');
        $stmt->execute([$key]);
        $row = $stmt->fetch();
        if ($row === false) {
            return null;
        }

        try {
            $value = json_decode((string) $row['value'], true, 64, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return null;
        }

        return is_array($value) ? ['value' => $value, 'updated_at' => (string) $row['updated_at']] : null;
    }

    /**
     * @param array<string,mixed> $value
     * @return string The saved timestamp
     */
    public function set(string $key, array $value): string
    {
        $now = Clock::now();
        $json = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        $exists = $this->db->prepare('SELECT 1 FROM site_settings WHERE setting_key = ?');
        $exists->execute([$key]);

        if ($exists->fetchColumn() !== false) {
            $this->db->prepare('UPDATE site_settings SET value = ?, updated_at = ? WHERE setting_key = ?')->execute([$json, $now, $key]);
        } else {
            $this->db->prepare('INSERT INTO site_settings (setting_key, value, updated_at) VALUES (?, ?, ?)')->execute([$key, $json, $now]);
        }

        return $now;
    }
}
