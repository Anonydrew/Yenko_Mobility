<?php

declare(strict_types=1);

namespace Yenko\Support;

use PDO;
use RuntimeException;

final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        return self::$connection ??= self::connect();
    }

    public static function driver(): string
    {
        return strtolower(Config::get('DB_DRIVER', 'sqlite') ?? 'sqlite');
    }

    private static function connect(): PDO
    {
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        switch (self::driver()) {
            case 'sqlite':
                $path = self::sqlitePath();
                $directory = dirname($path);
                if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
                    throw new RuntimeException("Could not create the database directory {$directory}.");
                }
                $pdo = new PDO('sqlite:' . $path, null, null, $options);
                $pdo->exec('PRAGMA foreign_keys = ON');
                $pdo->exec('PRAGMA journal_mode = WAL');
                $pdo->exec('PRAGMA busy_timeout = 5000');

                return $pdo;

            case 'mysql':
                $dsn = sprintf(
                    'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
                    Config::get('DB_HOST', '127.0.0.1'),
                    Config::int('DB_PORT', 3306),
                    Config::require('DB_NAME'),
                );
                $pdo = new PDO($dsn, Config::get('DB_USER', 'root'), Config::get('DB_PASSWORD', ''), $options);
                $pdo->exec("SET time_zone = '+00:00'");

                return $pdo;

            default:
                throw new RuntimeException('DB_DRIVER must be "sqlite" or "mysql".');
        }
    }

    public static function sqlitePath(): string
    {
        return Config::path('DB_SQLITE_PATH', 'database/yenko.sqlite');
    }
}
