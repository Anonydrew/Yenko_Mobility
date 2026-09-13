<?php

declare(strict_types=1);

namespace Yenko\Support;

use Yenko\Http\Request;

final class Paginator
{
    /** @return array{0:int,1:int,2:int} [page, perPage, offset] from ?page=&perPage= */
    public static function fromRequest(Request $request, int $defaultPerPage, int $maxPerPage): array
    {
        $page = max(1, (int) $request->query('page', '1'));
        $perPage = min($maxPerPage, max(1, (int) $request->query('perPage', (string) $defaultPerPage)));

        return [$page, $perPage, ($page - 1) * $perPage];
    }

    /** @return array{page:int,perPage:int,total:int,totalPages:int} */
    public static function meta(int $page, int $perPage, int $total): array
    {
        return [
            'page' => $page,
            'perPage' => $perPage,
            'total' => $total,
            'totalPages' => max(1, (int) ceil($total / $perPage)),
        ];
    }
}
