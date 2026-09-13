<?php

declare(strict_types=1);

// Usage: php database/seed.php
// Creates or updates the admin from .env, then adds the seed categories and posts.
// Safe to run repeatedly: existing categories and posts (matched by slug) are left untouched.

use Yenko\Controllers\PricingController;
use Yenko\Repositories\CategoryRepository;
use Yenko\Repositories\SettingsRepository;
use Yenko\Repositories\PostRepository;
use Yenko\Repositories\UserRepository;
use Yenko\Support\Clock;
use Yenko\Support\Config;

require dirname(__DIR__) . '/src/bootstrap.php';

try {
    $users = new UserRepository();
    $categories = new CategoryRepository();
    $posts = new PostRepository();

    // 1. Admin user
    $email = strtolower(trim(Config::require('ADMIN_EMAIL')));
    $password = Config::require('ADMIN_PASSWORD');
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        throw new RuntimeException('ADMIN_EMAIL is not a valid email address.');
    }
    if (strlen($password) < 10) {
        throw new RuntimeException('ADMIN_PASSWORD must be at least 10 characters.');
    }
    $result = $users->upsertAdmin($email, password_hash($password, PASSWORD_DEFAULT));
    echo "Admin {$email} {$result}." . PHP_EOL;

    // 2. Categories
    $categoryIds = [];
    $createdCategories = 0;
    foreach (require __DIR__ . '/seed/categories.php' as $category) {
        $existing = $categories->findBySlug($category['slug']);
        if ($existing === null) {
            $categoryIds[$category['slug']] = $categories->create($category['name'], $category['slug'], $category['description']);
            $createdCategories++;
        } else {
            $categoryIds[$category['slug']] = (int) $existing['id'];
        }
    }
    echo "Categories: {$createdCategories} created, " . (count($categoryIds) - $createdCategories) . ' already existed.' . PHP_EOL;

    // 3. Posts (markdown files with front matter) and their cover images
    $coverTarget = Config::uploadPath() . '/seed';
    if (!is_dir($coverTarget) && !mkdir($coverTarget, 0775, true) && !is_dir($coverTarget)) {
        throw new RuntimeException("Could not create {$coverTarget}.");
    }

    $files = glob(__DIR__ . '/seed/posts/*.md') ?: [];
    sort($files);
    $createdPosts = 0;

    foreach ($files as $file) {
        [$meta, $body] = parseFrontMatter((string) file_get_contents($file), basename($file));

        $coverImage = null;
        if (!empty($meta['cover'])) {
            $source = __DIR__ . '/seed/covers/' . $meta['cover'];
            if (is_file($source)) {
                copy($source, "{$coverTarget}/{$meta['cover']}");
                $coverImage = '/uploads/seed/' . $meta['cover'];
            } else {
                echo "  ! Cover {$meta['cover']} not found; {$meta['slug']} will have no cover." . PHP_EOL;
            }
        }

        if ($posts->findBySlug($meta['slug'], false) !== null) {
            continue;
        }

        $categoryId = $categoryIds[$meta['category']]
            ?? throw new RuntimeException("Unknown category \"{$meta['category']}\" in " . basename($file));

        // Dates are relative to today so the blog always looks recent on first run.
        $daysAgo = (int) $meta['daysAgo'];
        $publishedAt = (new DateTimeImmutable('now', new DateTimeZone('UTC')))
            ->modify("-{$daysAgo} days")
            ->setTime(7 + $daysAgo % 9, ($daysAgo * 7) % 60);

        $posts->create([
            'title' => $meta['title'],
            'slug' => $meta['slug'],
            'excerpt' => $meta['excerpt'],
            'body' => $body,
            'cover_image' => $coverImage,
            'status' => $meta['status'] ?? 'published',
            'published_at' => $publishedAt->format(Clock::DB_FORMAT),
            'category_id' => $categoryId,
            'created_at' => $publishedAt->modify('-3 days')->format(Clock::DB_FORMAT),
            'updated_at' => $publishedAt->format(Clock::DB_FORMAT),
        ]);
        $createdPosts++;
    }
    echo "Posts: {$createdPosts} created, " . (count($files) - $createdPosts) . ' already existed.' . PHP_EOL;

    // 4. Pricing (only if it has never been saved, so admin edits are kept)
    $settings = new SettingsRepository();
    if ($settings->get('pricing') === null) {
        $settings->set('pricing', PricingController::defaults());
        echo 'Pricing: default prices added.' . PHP_EOL;
    } else {
        echo 'Pricing: already set, left unchanged.' . PHP_EOL;
    }
    echo 'Seeding complete.' . PHP_EOL;
} catch (Throwable $e) {
    fwrite(STDERR, 'Seeding failed: ' . $e->getMessage() . PHP_EOL);
    exit(1);
}

/**
 * Splits "---\nkey: value\n---\nbody" into [meta, body]. Values may be wrapped in double quotes.
 *
 * @return array{0:array<string,string>,1:string}
 */
function parseFrontMatter(string $contents, string $filename): array
{
    $contents = str_replace("\r\n", "\n", $contents);
    if (preg_match('/\A---\n(.*?)\n---\n(.*)\z/s', $contents, $matches) !== 1) {
        throw new RuntimeException("{$filename} is missing its front matter block.");
    }

    $meta = [];
    foreach (explode("\n", $matches[1]) as $line) {
        if (trim($line) === '' || !str_contains($line, ':')) {
            continue;
        }
        [$key, $value] = array_map('trim', explode(':', $line, 2));
        if (strlen($value) >= 2 && $value[0] === '"' && str_ends_with($value, '"')) {
            $value = substr($value, 1, -1);
        }
        $meta[$key] = $value;
    }

    foreach (['title', 'slug', 'excerpt', 'category', 'daysAgo'] as $required) {
        if (($meta[$required] ?? '') === '') {
            throw new RuntimeException("{$filename} is missing \"{$required}\" in its front matter.");
        }
    }

    return [$meta, trim($matches[2]) . "\n"];
}
