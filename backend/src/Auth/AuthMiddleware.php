<?php

declare(strict_types=1);

namespace Yenko\Auth;

use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Repositories\UserRepository;
use Yenko\Support\Config;

final class AuthMiddleware
{
    public const COOKIE = 'yenko_session';

    public static function requireAdmin(Request $request): void
    {
        $token = $request->cookies[self::COOKIE] ?? null;
        $userId = is_string($token) && $token !== '' ? Jwt::userId($token) : null;
        $user = $userId !== null ? (new UserRepository())->find($userId) : null;

        if ($user === null) {
            throw HttpException::unauthorized();
        }

        $request->user = $user;
    }

    /** @return array<string,mixed> */
    public static function sessionCookieOptions(int $expiresAt): array
    {
        return [
            'expires' => $expiresAt,
            'path' => '/',
            'secure' => Config::bool('COOKIE_SECURE', Config::isProduction()),
            'httponly' => true,
            'samesite' => 'Lax',
        ];
    }
}
