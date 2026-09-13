<?php

declare(strict_types=1);

namespace Yenko\Auth;

use Yenko\Http\HttpException;
use Yenko\Http\Request;

/**
 * Cookie-authenticated requests that change data must carry X-Requested-With.
 * Browsers only send custom headers cross-site after a CORS preflight, which we don't approve for unknown origins.
 */
final class Csrf
{
    public static function verify(Request $request): void
    {
        if (in_array($request->method, ['GET', 'HEAD', 'OPTIONS'], true)) {
            return;
        }

        if (strtolower($request->header('x-requested-with') ?? '') !== 'xmlhttprequest') {
            throw new HttpException(403, 'Missing X-Requested-With: XMLHttpRequest header.');
        }
    }
}
