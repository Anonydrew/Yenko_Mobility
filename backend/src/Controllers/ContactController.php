<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use Yenko\Auth\RateLimiter;
use Yenko\Http\HttpException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\ContactRepository;
use Yenko\Support\Validator;

final class ContactController
{
    public function __construct(
        private readonly ContactRepository $contacts = new ContactRepository(),
        private readonly RateLimiter $limiter = new RateLimiter('contact', 5, 3600),
    ) {
    }

    /** POST /api/contact */
    public function store(Request $request): Response
    {
        $input = $request->json();

        // Honeypot: the "website" field is hidden from real visitors, so only bots fill it in.
        if (!empty($input['website'])) {
            return Response::json(['data' => ['received' => true]], 201);
        }

        $validator = new Validator($input);
        $topic = $validator->oneOf('topic', 'Topic', ContactRepository::TOPICS, 'general');
        $isWaitlist = $topic === 'waitlist';
        $data = [
            'name' => (string) $validator->text('name', 'Name', required: true, max: 120),
            'email' => (string) $validator->email('email', 'Email'),
            'topic' => $topic,
            'campus' => $validator->text('campus', 'Campus', max: 120),
            'message' => $validator->text('message', 'Message', required: !$isWaitlist, max: 5000, min: $isWaitlist ? 0 : 10) ?? '',
        ];
        $validator->validate();

        if ($this->limiter->tooMany($request->ip)) {
            throw HttpException::tooManyRequests('You have sent several messages recently. Please try again in an hour.');
        }
        $this->limiter->hit($request->ip);

        $id = $this->contacts->create($data);

        return Response::json(['data' => ['id' => $id, 'received' => true]], 201);
    }
}
