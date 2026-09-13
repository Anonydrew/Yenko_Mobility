<?php

declare(strict_types=1);

namespace Yenko\Auth;

use Firebase\JWT\JWT as FirebaseJwt;
use Firebase\JWT\Key;
use RuntimeException;
use Throwable;
use Yenko\Support\Config;

final class Jwt
{
    private const ALGORITHM = 'HS256';
    private const ISSUER = 'yenko-api';

    public static function issue(int $userId): string
    {
        $now = time();

        return FirebaseJwt::encode([
            'iss' => self::ISSUER,
            'sub' => (string) $userId,
            'iat' => $now,
            'exp' => $now + self::ttlSeconds(),
        ], self::secret(), self::ALGORITHM);
    }

    /** The user id in a valid token, or null when the token is invalid or expired. */
    public static function userId(string $token): ?int
    {
        $key = new Key(self::secret(), self::ALGORITHM);

        try {
            $claims = FirebaseJwt::decode($token, $key);
        } catch (Throwable) {
            return null;
        }

        $subject = (string) ($claims->sub ?? '');
        if (($claims->iss ?? null) !== self::ISSUER || !ctype_digit($subject)) {
            return null;
        }

        return (int) $subject;
    }

    public static function ttlSeconds(): int
    {
        return max(5, Config::int('JWT_TTL_MINUTES', 480)) * 60;
    }

    private static function secret(): string
    {
        $secret = Config::require('JWT_SECRET');
        if (strlen($secret) < 32) {
            throw new RuntimeException('JWT_SECRET must be at least 32 characters long.');
        }
        if (Config::isProduction() && str_starts_with($secret, 'replace-this')) {
            throw new RuntimeException('Set a real JWT_SECRET before running in production.');
        }

        return $secret;
    }
}
