<?php

declare(strict_types=1);

namespace Yenko\Support;

use Yenko\Http\HttpException;

/**
 * Returns cleaned values while collecting per-field errors, then throws a single 422 from validate().
 */
final class Validator
{
    /** @var array<string,string> */
    private array $errors = [];

    /** @param array<string,mixed> $data */
    public function __construct(private readonly array $data)
    {
    }

    /** Trimmed text, or null when empty. */
    public function text(string $field, string $label, bool $required = false, int $max = 255, int $min = 0): ?string
    {
        $raw = $this->data[$field] ?? null;
        if ($raw !== null && !is_scalar($raw)) {
            $this->addError($field, "{$label} must be text.");

            return null;
        }

        $value = trim((string) $raw);
        if ($value === '') {
            if ($required) {
                $this->addError($field, "{$label} is required.");
            }

            return null;
        }

        $length = mb_strlen($value, 'UTF-8');
        if ($length < $min) {
            $this->addError($field, "{$label} must be at least {$min} characters.");
        } elseif ($length > $max) {
            $this->addError($field, "{$label} must be {$max} characters or fewer.");
        }

        return $value;
    }

    public function email(string $field, string $label, bool $required = true): ?string
    {
        $value = $this->text($field, $label, $required, 191);
        if ($value !== null && !$this->hasError($field) && filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
            $this->addError($field, 'Enter a valid email address.');
        }

        return $value === null ? null : strtolower($value);
    }

    /** @param list<string> $allowed */
    public function oneOf(string $field, string $label, array $allowed, string $default): string
    {
        $value = $this->data[$field] ?? null;
        if ($value === null || $value === '') {
            return $default;
        }
        if (!is_string($value) || !in_array($value, $allowed, true)) {
            $this->addError($field, "{$label} must be one of: " . implode(', ', $allowed) . '.');

            return $default;
        }

        return $value;
    }

    public function integer(string $field, string $label, bool $required = false): ?int
    {
        $value = $this->data[$field] ?? null;
        if ($value === null || $value === '') {
            if ($required) {
                $this->addError($field, "{$label} is required.");
            }

            return null;
        }
        if (is_int($value) || (is_string($value) && ctype_digit($value))) {
            return (int) $value;
        }

        $this->addError($field, "{$label} must be a whole number.");

        return null;
    }

    /** Keeps the first error for each field. */
    public function addError(string $field, string $message): void
    {
        $this->errors[$field] ??= $message;
    }

    public function hasError(string $field): bool
    {
        return isset($this->errors[$field]);
    }

    public function validate(): void
    {
        if ($this->errors !== []) {
            throw HttpException::validation($this->errors);
        }
    }
}
