<?php

declare(strict_types=1);

namespace Yenko\Controllers;

use RuntimeException;
use Yenko\Http\Request;
use Yenko\Http\Response;
use Yenko\Repositories\SettingsRepository;
use Yenko\Support\Clock;
use Yenko\Support\PricingValidator;

final class PricingController
{
    private const KEY = 'pricing';

    public function __construct(private readonly SettingsRepository $settings = new SettingsRepository())
    {
    }

    /** GET /api/pricing */
    public function show(Request $request): Response
    {
        return Response::json(['data' => $this->current()['value']]);
    }

    /** GET /api/admin/pricing */
    public function adminShow(Request $request): Response
    {
        return $this->adminResponse($this->current());
    }

    /** PUT /api/admin/pricing with { data: {...} } */
    public function update(Request $request): Response
    {
        $body = $request->json();
        $clean = (new PricingValidator())->validate($body['data'] ?? null);
        $updatedAt = $this->settings->set(self::KEY, $clean);

        return $this->adminResponse(['value' => $clean, 'updated_at' => $updatedAt]);
    }

    /** POST /api/admin/pricing/reset: restores the default prices from database/seed/pricing.json. */
    public function reset(Request $request): Response
    {
        $defaults = self::defaults();
        $updatedAt = $this->settings->set(self::KEY, $defaults);

        return $this->adminResponse(['value' => $defaults, 'updated_at' => $updatedAt]);
    }

    /** @return array<string,mixed> The validated default pricing shipped with the code. */
    public static function defaults(): array
    {
        $path = BASE_PATH . '/database/seed/pricing.json';
        $contents = is_file($path) ? file_get_contents($path) : false;
        if ($contents === false) {
            throw new RuntimeException('Default pricing file is missing: database/seed/pricing.json');
        }

        return (new PricingValidator())->validate(json_decode($contents, true, 64, JSON_THROW_ON_ERROR));
    }

    /** @return array{value:array<string,mixed>,updated_at:?string} */
    private function current(): array
    {
        return $this->settings->get(self::KEY) ?? ['value' => self::defaults(), 'updated_at' => null];
    }

    /** @param array{value:array<string,mixed>,updated_at:?string} $pricing */
    private function adminResponse(array $pricing): Response
    {
        return Response::json([
            'data' => $pricing['value'],
            'meta' => [
                'updatedAt' => Clock::toIso($pricing['updated_at']),
                'isDefault' => $pricing['updated_at'] === null,
            ],
        ]);
    }
}
