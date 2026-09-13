<?php

declare(strict_types=1);

namespace Yenko\Support;

use DateTimeImmutable;
use DateTimeZone;
use Exception;

/** Timestamps are stored as UTC "Y-m-d H:i:s" and returned by the API as ISO 8601. */
final class Clock
{
    public const DB_FORMAT = 'Y-m-d H:i:s';

    public static function now(): string
    {
        return gmdate(self::DB_FORMAT);
    }

    public static function toIso(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return (new DateTimeImmutable($value, new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s\Z');
        } catch (Exception) {
            return null;
        }
    }

    /** Parses a date from user input (any format DateTime understands) into the storage format. */
    public static function fromInput(mixed $value): ?string
    {
        if (!is_string($value) || trim($value) === '') {
            return null;
        }

        try {
            return (new DateTimeImmutable($value, new DateTimeZone('UTC')))
                ->setTimezone(new DateTimeZone('UTC'))
                ->format(self::DB_FORMAT);
        } catch (Exception) {
            return null;
        }
    }
}
