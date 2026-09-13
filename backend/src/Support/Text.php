<?php

declare(strict_types=1);

namespace Yenko\Support;

final class Text
{
    /** A plain-text summary of a markdown document, cut at a word boundary. */
    public static function excerpt(string $markdown, int $limit = 220): string
    {
        $text = preg_replace(
            [
                '/```.*?```/s',                          // fenced code
                '/!\[[^\]]*\]\([^)]*\)/',                // images
                '/\[([^\]]*)\]\([^)]*\)/',               // links → link text
                '/^\s{0,3}(?:#{1,6}|>|[-*+]|\d+\.)\s+/m', // headings, quotes, list markers
                '/^\|.*\|$/m',                           // table rows
                '/[*_`~]+/',                             // emphasis
                '/\s+/',
            ],
            ['', '', '$1', '', '', '', ' '],
            $markdown,
        ) ?? $markdown;
        $text = trim($text);

        if (mb_strlen($text) <= $limit) {
            return $text;
        }

        $cut = mb_substr($text, 0, $limit);
        $lastSpace = mb_strrpos($cut, ' ');
        if ($lastSpace !== false && $lastSpace > $limit * 0.6) {
            $cut = mb_substr($cut, 0, $lastSpace);
        }

        return rtrim($cut, ' ,.;:-') . '…';
    }
}
