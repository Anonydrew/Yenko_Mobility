<?php

declare(strict_types=1);

use Dotenv\Dotenv;

define('BASE_PATH', dirname(__DIR__));    // backend/
define('PROJECT_ROOT', dirname(BASE_PATH)); // repository root (where .env lives)

$autoload = BASE_PATH . '/vendor/autoload.php';
if (!is_file($autoload)) {
    $message = 'Dependencies are missing. Run "composer install" inside the backend folder.';
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, $message . PHP_EOL);
    } else {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => ['message' => $message]]);
    }
    exit(1);
}
require $autoload;

// .env lives in the project root during development, or next to the backend folder's contents when deployed.
Dotenv::createImmutable([PROJECT_ROOT, BASE_PATH])->safeLoad();

date_default_timezone_set('UTC');
