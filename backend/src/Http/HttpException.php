<?php

declare(strict_types=1);

namespace Yenko\Http;

use RuntimeException;

/** Thrown anywhere in a request; the front controller turns it into a JSON error response. */
class HttpException extends RuntimeException
{
    /** @param array<string,string> $fields Per-field validation messages */
    public function __construct(public readonly int $status, string $message, public readonly array $fields = [])
    {
        parent::__construct($message);
    }

    public static function notFound(string $message = 'Not found.'): self
    {
        return new self(404, $message);
    }

    public static function unauthorized(string $message = 'Please log in to continue.'): self
    {
        return new self(401, $message);
    }

    public static function conflict(string $message): self
    {
        return new self(409, $message);
    }

    /** @param array<string,string> $fields */
    public static function validation(array $fields, string $message = 'Some fields need your attention.'): self
    {
        return new self(422, $message, $fields);
    }

    public static function tooManyRequests(string $message): self
    {
        return new self(429, $message);
    }
}
