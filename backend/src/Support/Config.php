<?php

declare(strict_types=1);

namespace Yenko\Support;

use RuntimeException;

/** Typed access to environment variables loaded from .env. */
final class Config
{
    public static function get(string $key, ?string $default = null): ?string
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
        if ($value === false || $value === null || $value === '') {
            return $default;
        }

        return (string) $value;
    }

    public static function require(string $key): string
    {
        $value = self::get($key);
        if ($value === null) {
            throw new RuntimeException("Missing environment variable {$key}. Copy .env.example to .env and fill it in.");
        }

        return $value;
    }

    public static function bool(string $key, bool $default = false): bool
    {
        $value = self::get($key);

        return $value === null ? $default : filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public static function int(string $key, int $default): int
    {
        $value = self::get($key);

        return $value !== null && is_numeric($value) ? (int) $value : $default;
    }

    /** A filesystem path from .env. Relative paths are resolved against the backend folder. */
    public static function path(string $key, string $default): string
    {
        $path = self::get($key, $default) ?? $default;
        $isAbsolute = preg_match('#^(?:[A-Za-z]:[\\\\/]|[\\\\/])#', $path) === 1;

        return $isAbsolute ? $path : BASE_PATH . '/' . $path;
    }

    /**
     * Where uploaded images are stored; served publicly at /uploads.
     * Without UPLOAD_PATH, a deployed backend (see scripts/package.mjs) finds the web root by its api/index.php,
     * whether yenko-backend sits next to public_html or inside it.
     */
    public static function uploadPath(): string
    {
        if (self::get('UPLOAD_PATH') !== null) {
            return rtrim(self::path('UPLOAD_PATH', 'public/uploads'), '/\\');
        }

        $parent = dirname(BASE_PATH);
        foreach ([$parent . '/public_html', $parent] as $webRoot) {
            if (is_file($webRoot . '/api/index.php')) {
                return $webRoot . '/uploads';
            }
        }

        return BASE_PATH . '/public/uploads';
    }

    public static function isProduction(): bool
    {
        return self::get('APP_ENV', 'development') === 'production';
    }
}
