<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use Yenko\Auth\AuthMiddleware;
use Yenko\Auth\Jwt;
use Yenko\Auth\RateLimiter;
use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\UserRepository;
use Yenko\Support\Validator;

final class AuthController
{
    public function __construct(
        private readonly UserRepository $users = new UserRepository(),
        private readonly RateLimiter $limiter = new RateLimiter('login', 5, 900),
    ) {
    }

    /** POST /api/auth/login */
    public function login(Request $request): Response
    {
        $input = $request->json();
        $validator = new Validator($input);
        $email = (string) $validator->email('email', 'Email');
        $password = is_string($input['password'] ?? null) ? $input['password'] : '';
        if ($password === '') {
            $validator->addError('password', 'Password is required.');
        }
        $validator->validate();

        if ($this->limiter->tooMany($request->ip)) {
            throw HttpException::tooManyRequests('Too many login attempts. Please wait 15 minutes and try again.');
        }

        $user = $this->users->findByEmail($email);
        // Check against a throwaway hash when the email is unknown, so response times don't reveal which emails exist.
        $passwordMatches = password_verify($password, $user['password_hash'] ?? password_hash('not-the-password', PASSWORD_DEFAULT));
        if ($user === null || !$passwordMatches) {
            $this->limiter->hit($request->ip);
            throw HttpException::unauthorized('That email and password combination is incorrect.');
        }

        $this->limiter->clear($request->ip);
        if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
            $this->users->updatePasswordHash((int) $user['id'], password_hash($password, PASSWORD_DEFAULT));
        }

        return Response::json(['data' => UserRepository::toApi($user)])->withCookie(
            AuthMiddleware::COOKIE,
            Jwt::issue((int) $user['id']),
            AuthMiddleware::sessionCookieOptions(time() + Jwt::ttlSeconds()),
        );
    }

    /** POST /api/auth/logout */
    public function logout(Request $request): Response
    {
        return Response::noContent()->withCookie(
            AuthMiddleware::COOKIE,
            '',
            AuthMiddleware::sessionCookieOptions(time() - 3600),
        );
    }

    /** GET /api/auth/me */
    public function me(Request $request): Response
    {
        return Response::json(['data' => UserRepository::toApi((array) $request->user)]);
    }
}
