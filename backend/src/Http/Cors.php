<?php

declare(strict_types=1);

namespace Yenko\Http;

use Yenko\Support\Config;

/** Only used when the frontend runs on a different origin; the Vite proxy makes it unnecessary in dev. */
final class Cors
{
    public static function handlePreflight(Request $request): ?Response
    {
        if ($request->method !== 'OPTIONS') {
            return null;
        }

        return Response::noContent()
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
            ->withHeader('Access-Control-Max-Age', '600');
    }

    public static function apply(Request $request, Response $response): void
    {
        $origin = $request->header('origin');
        if ($origin === null || !in_array($origin, self::allowedOrigins(), true)) {
            return;
        }

        $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withHeader('Vary', 'Origin');
    }

    /** @return list<string> */
    private static function allowedOrigins(): array
    {
        $origins = array_map('trim', explode(',', Config::get('CORS_ALLOWED_ORIGINS', '') ?? ''));

        return array_values(array_filter($origins));
    }
}
