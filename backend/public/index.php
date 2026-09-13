<?php

declare(strict_types=1);

use Yenko\Http\Cors;
use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Http\Router;
use Yenko\Support\Config;

require dirname(__DIR__) . '/src/bootstrap.php';

$request = Request::fromGlobals();

try {
    $response = Cors::handlePreflight($request);
    if ($response === null) {
        $router = new Router();
        (require BASE_PATH . '/src/routes.php')($router);
        $response = $router->dispatch($request);
    }
} catch (HttpException $e) {
    $response = Response::error($e->getMessage(), $e->status, $e->fields);
} catch (Throwable $e) {
    error_log((string) $e);
    $message = Config::bool('APP_DEBUG') ? $e->getMessage() : 'Something went wrong on our side. Please try again.';
    $response = Response::error($message, 500);
}

Cors::apply($request, $response);
$response->send();
