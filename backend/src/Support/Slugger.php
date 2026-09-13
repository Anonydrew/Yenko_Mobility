<?php

declare(strict_types=1);

namespace Yenko\Support;

final class Slugger
{
    public static function slugify(string $text, int $maxLength = 120): string
    {
        $text = str_replace('&', ' and ', $text);

        if (function_exists('transliterator_transliterate')) {
            $text = (string) transliterator_transliterate('Any-Latin; Latin-ASCII', $text);
        } elseif (function_exists('iconv')) {
            $text = (string) @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
        }

        $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower($text)) ?? '';

        return trim(substr(trim($slug, '-'), 0, $maxLength), '-');
    }

    /**
     * Appends -2, -3… until the slug is free.
     *
     * @param callable(string):bool $isTaken
     */
    public static function unique(string $base, callable $isTaken): string
    {
        $base = $base !== '' ? $base : 'untitled';
        $slug = $base;

        for ($suffix = 2; $isTaken($slug); $suffix++) {
            $slug = "{$base}-{$suffix}";
        }

        return $slug;
    }
}
