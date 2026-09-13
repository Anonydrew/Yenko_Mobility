<?php

declare(strict_types=1);

namespace Yenko\Http;

final class Response
{
    /** @var array<string,string> */
    private array $headers = [
        'Content-Type' => 'application/json; charset=utf-8',
        'Cache-Control' => 'no-store',
        'X-Content-Type-Options' => 'nosniff',
    ];

    /** @var list<array{name:string,value:string,options:array<string,mixed>}> */
    private array $cookies = [];

    private function __construct(private readonly mixed $body, private readonly int $status)
    {
    }

    public static function json(mixed $body, int $status = 200): self
    {
        return new self($body, $status);
    }

    public static function noContent(): self
    {
        return new self(null, 204);
    }

    /** @param array<string,string> $fields Per-field validation messages */
    public static function error(string $message, int $status, array $fields = []): self
    {
        $error = ['message' => $message];
        if ($fields !== []) {
            $error['fields'] = $fields;
        }

        return new self(['error' => $error], $status);
    }

    public function withHeader(string $name, string $value): self
    {
        $this->headers[$name] = $value;

        return $this;
    }

    /** @param array<string,mixed> $options Options accepted by setcookie() */
    public function withCookie(string $name, string $value, array $options): self
    {
        $this->cookies[] = ['name' => $name, 'value' => $value, 'options' => $options];

        return $this;
    }

    public function send(): void
    {
        http_response_code($this->status);
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        foreach ($this->cookies as $cookie) {
            setcookie($cookie['name'], $cookie['value'], $cookie['options']);
        }
        if ($this->status !== 204 && $this->body !== null) {
            echo json_encode($this->body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        }
    }
}
