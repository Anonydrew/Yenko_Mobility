<?php

// Router for PHP's built-in dev server (`composer serve`).
// Files that exist under /uploads are served as-is; every other request goes to the API.

$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');

if (str_starts_with($path, '/uploads/')) {
    $file = realpath(__DIR__ . $path);
    $uploads = realpath(__DIR__ . '/uploads');
    if ($file !== false && $uploads !== false && str_starts_with($file, $uploads . DIRECTORY_SEPARATOR) && is_file($file)) {
        return false;
    }
}

require __DIR__ . '/index.php';
