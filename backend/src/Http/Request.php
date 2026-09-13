<?php

declare(strict_types=1);

namespace Yenko\Http;

use JsonException;
use Yenko\Support\Config;

final class Request
{
    /** @var array<string,string> Route parameters, filled in by the router. */
    public array $params = [];

    /** @var array<string,mixed>|null The logged-in admin, set by AuthMiddleware. */
    public ?array $user = null;

    /** @var array<string,mixed>|null */
    private ?array $json = null;

    /**
     * @param array<string,mixed> $queryParams
     * @param array<string,string> $headers Lower-cased header names
     * @param array<string,mixed> $cookies
     * @param array<string,mixed> $files
     */
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        private readonly array $queryParams,
        private readonly array $headers,
        public readonly array $cookies,
        public readonly array $files,
        private readonly string $rawBody,
        public readonly string $ip,
    ) {
    }

    public static function fromGlobals(): self
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $headers[strtolower(str_replace('_', '-', substr($key, 5)))] = (string) $value;
            }
        }
        foreach (['CONTENT_TYPE' => 'content-type', 'CONTENT_LENGTH' => 'content-length'] as $key => $name) {
            if (isset($_SERVER[$key])) {
                $headers[$name] = (string) $_SERVER[$key];
            }
        }

        $path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
        $path = '/' . trim($path, '/');

        $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
        if (Config::bool('TRUST_PROXY') && !empty($headers['x-forwarded-for'])) {
            $ip = trim(explode(',', $headers['x-forwarded-for'])[0]);
        }

        return new self(
            strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')),
            $path,
            $_GET,
            $headers,
            $_COOKIE,
            $_FILES,
            (string) file_get_contents('php://input'),
            $ip,
        );
    }

    public function header(string $name): ?string
    {
        return $this->headers[strtolower($name)] ?? null;
    }

    /** A trimmed query-string value, or $default when it's missing, empty or not a string. */
    public function query(string $key, ?string $default = null): ?string
    {
        $value = $this->queryParams[$key] ?? null;

        return is_string($value) && trim($value) !== '' ? trim($value) : $default;
    }

    public function param(string $name): string
    {
        return $this->params[$name] ?? '';
    }

    /** A numeric route parameter; anything else is treated as a missing resource. */
    public function idParam(string $name = 'id'): int
    {
        $value = $this->param($name);
        if (!ctype_digit($value)) {
            throw HttpException::notFound();
        }

        return (int) $value;
    }

    /** @return array<string,mixed> */
    public function json(): array
    {
        if ($this->json !== null) {
            return $this->json;
        }
        if (trim($this->rawBody) === '') {
            return $this->json = [];
        }
        if (!str_contains(strtolower($this->header('content-type') ?? ''), 'application/json')) {
            throw new HttpException(415, 'Send the request body as JSON.');
        }

        try {
            $decoded = json_decode($this->rawBody, true, 32, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new HttpException(400, 'The request body is not valid JSON.');
        }
        if (!is_array($decoded)) {
            throw new HttpException(400, 'The request body must be a JSON object.');
        }

        return $this->json = $decoded;
    }
}
