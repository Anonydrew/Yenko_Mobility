<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\CategoryRepository;
use Yenko\Repositories\PostRepository;
use Yenko\Support\Clock;
use Yenko\Support\Paginator;
use Yenko\Support\Slugger;
use Yenko\Support\Text;
use Yenko\Support\Validator;

final class AdminPostController
{
    public function __construct(
        private readonly PostRepository $posts = new PostRepository(),
        private readonly CategoryRepository $categories = new CategoryRepository(),
    ) {
    }

    /** GET /api/admin/posts?page=&perPage=&status=&category=&q= */
    public function index(Request $request): Response
    {
        [$page, $perPage, $offset] = Paginator::fromRequest($request, 20, 100);

        $status = $request->query('status');
        if ($status !== null && !in_array($status, PostRepository::STATUSES, true)) {
            throw HttpException::validation(['status' => 'Status must be draft or published.']);
        }

        $categoryId = null;
        $categorySlug = $request->query('category');
        if ($categorySlug !== null) {
            $category = $this->categories->findBySlug($categorySlug) ?? throw HttpException::notFound('Category not found.');
            $categoryId = (int) $category['id'];
        }

        [$rows, $total] = $this->posts->paginate(
            ['status' => $status, 'categoryId' => $categoryId, 'search' => $request->query('q')],
            $perPage,
            $offset,
        );

        return Response::json([
            'data' => array_map(static fn (array $row): array => PostRepository::toApi($row), $rows),
            'meta' => Paginator::meta($page, $perPage, $total),
        ]);
    }

    /** GET /api/admin/posts/{id} */
    public function show(Request $request): Response
    {
        return Response::json(['data' => PostRepository::toApi($this->findOrFail($request), true)]);
    }

    /** POST /api/admin/posts */
    public function store(Request $request): Response
    {
        $id = $this->posts->create($this->validated($request->json(), null));

        return Response::json(['data' => PostRepository::toApi((array) $this->posts->find($id), true)], 201);
    }

    /** PUT /api/admin/posts/{id} — fields left out keep their current values. */
    public function update(Request $request): Response
    {
        $post = $this->findOrFail($request);
        $this->posts->update((int) $post['id'], $this->validated($request->json(), $post));

        return Response::json(['data' => PostRepository::toApi((array) $this->posts->find((int) $post['id']), true)]);
    }

    /** DELETE /api/admin/posts/{id} */
    public function destroy(Request $request): Response
    {
        $post = $this->findOrFail($request);
        $this->posts->delete((int) $post['id']);

        return Response::noContent();
    }

    /** @return array<string,mixed> */
    private function findOrFail(Request $request): array
    {
        return $this->posts->find($request->idParam()) ?? throw HttpException::notFound('Post not found.');
    }

    /**
     * @param array<string,mixed> $input
     * @param array<string,mixed>|null $existing
     * @return array<string,mixed> Column values for the repository
     */
    private function validated(array $input, ?array $existing): array
    {
        $ignoreId = $existing !== null ? (int) $existing['id'] : null;
        if ($existing !== null) {
            $input += [
                'title' => $existing['title'],
                'slug' => $existing['slug'],
                'excerpt' => $existing['excerpt'],
                'body' => $existing['body'],
                'coverImage' => $existing['cover_image'],
                'status' => $existing['status'],
                'publishedAt' => $existing['published_at'],
                'categoryId' => (int) $existing['category_id'],
            ];
        }

        $validator = new Validator($input);
        $status = $validator->oneOf('status', 'Status', PostRepository::STATUSES, 'draft');
        $title = (string) $validator->text('title', 'Title', required: true, max: 200);
        $slugInput = $validator->text('slug', 'Slug', max: 120);
        $excerpt = $validator->text('excerpt', 'Excerpt', max: 500) ?? '';
        $body = $validator->text('body', 'Body', required: $status === 'published', max: 100000) ?? '';
        $coverImage = $validator->text('coverImage', 'Cover image', max: 500);
        $categoryId = $validator->integer('categoryId', 'Category', required: true);

        if ($coverImage !== null && preg_match('#^(/uploads/|https://)#', $coverImage) !== 1) {
            $validator->addError('coverImage', 'Cover image must be an uploaded image or an https:// URL.');
        }
        if ($categoryId !== null && $this->categories->find($categoryId) === null) {
            $validator->addError('categoryId', 'Choose a category that exists.');
        }

        $publishedAt = null;
        $rawPublishedAt = $input['publishedAt'] ?? null;
        if ($rawPublishedAt !== null && $rawPublishedAt !== '') {
            $publishedAt = Clock::fromInput($rawPublishedAt);
            if ($publishedAt === null) {
                $validator->addError('publishedAt', 'Publish date is not a valid date.');
            }
        }

        // A slug typed by the editor must be free; one generated from the title gets a -2, -3… suffix instead.
        $slug = Slugger::slugify($slugInput ?? $title);
        if ($slugInput !== null) {
            if ($slug === '') {
                $validator->addError('slug', 'Slug must contain letters or numbers.');
            } elseif ($this->posts->slugTaken($slug, $ignoreId)) {
                $validator->addError('slug', 'Another post already uses this slug.');
            }
        }

        $validator->validate();

        if ($slugInput === null) {
            $slug = Slugger::unique($slug, fn (string $candidate): bool => $this->posts->slugTaken($candidate, $ignoreId));
        }
        if ($status === 'published' && $publishedAt === null) {
            $publishedAt = Clock::now();
        }
        if ($excerpt === '' && $body !== '') {
            $excerpt = Text::excerpt($body);
        }

        return [
            'title' => $title,
            'slug' => $slug,
            'excerpt' => $excerpt,
            'body' => $body,
            'cover_image' => $coverImage,
            'status' => $status,
            'published_at' => $publishedAt,
            'category_id' => $categoryId,
        ];
    }
}
