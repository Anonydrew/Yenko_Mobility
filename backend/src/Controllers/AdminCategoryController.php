<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\CategoryRepository;
use Yenko\Support\Slugger;
use Yenko\Support\Validator;

final class AdminCategoryController
{
    public function __construct(private readonly CategoryRepository $categories = new CategoryRepository())
    {
    }

    /** GET /api/admin/categories — counts include drafts. */
    public function index(Request $request): Response
    {
        $rows = $this->categories->allWithCounts(publicCounts: false);

        return Response::json(['data' => array_map(CategoryRepository::toApi(...), $rows)]);
    }

    /** POST /api/admin/categories */
    public function store(Request $request): Response
    {
        [$name, $slug, $description] = $this->validated($request->json(), null);
        $id = $this->categories->create($name, $slug, $description);

        return Response::json(['data' => $this->present($id)], 201);
    }

    /** PUT /api/admin/categories/{id} — fields left out keep their current values. */
    public function update(Request $request): Response
    {
        $category = $this->findOrFail($request);
        [$name, $slug, $description] = $this->validated($request->json(), $category);
        $this->categories->update((int) $category['id'], $name, $slug, $description);

        return Response::json(['data' => $this->present((int) $category['id'])]);
    }

    /** DELETE /api/admin/categories/{id} */
    public function destroy(Request $request): Response
    {
        $category = $this->findOrFail($request);
        $postCount = $this->categories->postCount((int) $category['id']);
        if ($postCount > 0) {
            $posts = $postCount === 1 ? '1 post' : "{$postCount} posts";
            throw HttpException::conflict("\"{$category['name']}\" still has {$posts}. Move or delete them before deleting the category.");
        }

        $this->categories->delete((int) $category['id']);

        return Response::noContent();
    }

    /** @return array<string,mixed> */
    private function findOrFail(Request $request): array
    {
        return $this->categories->find($request->idParam()) ?? throw HttpException::notFound('Category not found.');
    }

    /** @return array<string,mixed> */
    private function present(int $id): array
    {
        return CategoryRepository::toApi((array) $this->categories->find($id) + ['post_count' => $this->categories->postCount($id)]);
    }

    /**
     * @param array<string,mixed> $input
     * @param array<string,mixed>|null $existing
     * @return array{0:string,1:string,2:?string} [name, slug, description]
     */
    private function validated(array $input, ?array $existing): array
    {
        $ignoreId = $existing !== null ? (int) $existing['id'] : null;
        if ($existing !== null) {
            $input += ['name' => $existing['name'], 'slug' => $existing['slug'], 'description' => $existing['description']];
        }

        $validator = new Validator($input);
        $name = (string) $validator->text('name', 'Name', required: true, max: 80);
        $slugInput = $validator->text('slug', 'Slug', max: 100);
        $description = $validator->text('description', 'Description', max: 500);

        if ($name !== '' && !$validator->hasError('name') && $this->categories->nameTaken($name, $ignoreId)) {
            $validator->addError('name', 'A category with this name already exists.');
        }

        $slug = Slugger::slugify($slugInput ?? $name, 100);
        if ($slugInput !== null) {
            if ($slug === '') {
                $validator->addError('slug', 'Slug must contain letters or numbers.');
            } elseif ($this->categories->slugTaken($slug, $ignoreId)) {
                $validator->addError('slug', 'Another category already uses this slug.');
            }
        }

        $validator->validate();

        if ($slugInput === null) {
            $slug = Slugger::unique($slug, fn (string $candidate): bool => $this->categories->slugTaken($candidate, $ignoreId));
        }

        return [$name, $slug, $description];
    }
}
