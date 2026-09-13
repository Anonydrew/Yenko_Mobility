<?php

declare(strict_types=1);

use Yenko\Auth\AuthMiddleware;
use Yenko\Auth\Csrf;
use Yenko\Controllers\AdminCategoryController;
use Yenko\Controllers\AdminContactController;
use Yenko\Controllers\AdminPostController;
use Yenko\Controllers\AuthController;
use Yenko\Controllers\ContactController;
use Yenko\Controllers\PricingController;
use Yenko\Controllers\PublicCategoryController;
use Yenko\Controllers\PublicPostController;
use Yenko\Controllers\UploadController;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Http\Router;
use Yenko\Support\Clock;

return static function (Router $router): void {
    $router->get('/', static fn (Request $request): Response => Response::json([
        'message' => 'The Yenko API is running. The website itself is served by the frontend: run "npm run dev" and open http://localhost:5173.',
        'health' => '/api/health',
    ]));

    $router->get('/api/health', static fn (Request $request): Response => Response::json([
        'status' => 'ok',
        'time' => Clock::toIso(Clock::now()),
    ]));

    // Public
    $router->get('/api/posts', [PublicPostController::class, 'index']);
    $router->get('/api/posts/{slug}', [PublicPostController::class, 'show']);
    $router->get('/api/categories', [PublicCategoryController::class, 'index']);
    $router->post('/api/contact', [ContactController::class, 'store']);
    $router->get('/api/pricing', [PricingController::class, 'show']);

    // Auth
    $router->post('/api/auth/login', [AuthController::class, 'login'], [Csrf::verify(...)]);
    $router->post('/api/auth/logout', [AuthController::class, 'logout'], [Csrf::verify(...)]);
    $router->get('/api/auth/me', [AuthController::class, 'me'], [AuthMiddleware::requireAdmin(...)]);

    // Admin
    $router->group('/api/admin', [AuthMiddleware::requireAdmin(...), Csrf::verify(...)], static function (Router $admin): void {
        $admin->get('/posts', [AdminPostController::class, 'index']);
        $admin->post('/posts', [AdminPostController::class, 'store']);
        $admin->get('/posts/{id}', [AdminPostController::class, 'show']);
        $admin->put('/posts/{id}', [AdminPostController::class, 'update']);
        $admin->delete('/posts/{id}', [AdminPostController::class, 'destroy']);

        $admin->get('/categories', [AdminCategoryController::class, 'index']);
        $admin->post('/categories', [AdminCategoryController::class, 'store']);
        $admin->put('/categories/{id}', [AdminCategoryController::class, 'update']);
        $admin->delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

        $admin->post('/uploads', [UploadController::class, 'store']);

        $admin->get('/contact-submissions', [AdminContactController::class, 'index']);

        $admin->get('/pricing', [PricingController::class, 'adminShow']);
        $admin->put('/pricing', [PricingController::class, 'update']);
        $admin->post('/pricing/reset', [PricingController::class, 'reset']);
    });
};
