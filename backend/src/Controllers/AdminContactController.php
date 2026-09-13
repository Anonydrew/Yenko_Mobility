<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\ContactRepository;
use Yenko\Support\Paginator;

final class AdminContactController
{
    public function __construct(private readonly ContactRepository $contacts = new ContactRepository())
    {
    }

    /** GET /api/admin/contact-submissions?page=&perPage=&topic= */
    public function index(Request $request): Response
    {
        [$page, $perPage, $offset] = Paginator::fromRequest($request, 20, 100);

        $topic = $request->query('topic');
        if ($topic !== null && !in_array($topic, ContactRepository::TOPICS, true)) {
            throw HttpException::validation(['topic' => 'Topic must be one of: ' . implode(', ', ContactRepository::TOPICS) . '.']);
        }

        [$rows, $total] = $this->contacts->paginate($topic, $perPage, $offset);

        return Response::json([
            'data' => array_map(ContactRepository::toApi(...), $rows),
            'meta' => Paginator::meta($page, $perPage, $total),
        ]);
    }
}
