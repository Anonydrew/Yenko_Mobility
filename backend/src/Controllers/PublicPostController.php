<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\CategoryRepository;
use Yenko\Repositories\PostRepository;
use Yenko\Support\Paginator;

final class PublicPostController
{
    public function __construct(
        private readonly PostRepository $posts = new PostRepository(),
        private readonly CategoryRepository $categories = new CategoryRepository(),
    ) {
    }

    /** GET /api/posts?page=&perPage=&category= */
    public function index(Request $request): Response
    {
        [$page, $perPage, $offset] = Paginator::fromRequest($request, 6, 24);

        $categoryId = null;
        $categorySlug = $request->query('category');
        if ($categorySlug !== null) {
            $category = $this->categories->findBySlug($categorySlug) ?? throw HttpException::notFound('Category not found.');
            $categoryId = (int) $category['id'];
        }

        [$rows, $total] = $this->posts->paginate(['publishedOnly' => true, 'categoryId' => $categoryId], $perPage, $offset);

        return Response::json([
            'data' => array_map(static fn (array $row): array => PostRepository::toApi($row), $rows),
            'meta' => Paginator::meta($page, $perPage, $total),
        ]);
    }

    /** GET /api/posts/{slug} */
    public function show(Request $request): Response
    {
        $post = $this->posts->findBySlug($request->param('slug'), true) ?? throw HttpException::notFound('Post not found.');

        return Response::json(['data' => PostRepository::toApi($post, true)]);
    }
}
