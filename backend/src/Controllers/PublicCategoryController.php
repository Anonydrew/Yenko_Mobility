<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\CategoryRepository;

final class PublicCategoryController
{
    public function __construct(private readonly CategoryRepository $categories = new CategoryRepository())
    {
    }

    /** GET /api/categories */
    public function index(Request $request): Response
    {
        $rows = $this->categories->allWithCounts(publicCounts: true);

        return Response::json(['data' => array_map(CategoryRepository::toApi(...), $rows)]);
    }
}
