<?php

declare(strict_types=1);

namespace Yenko\Support;

use Yenko\Http\HttpException;

/**
 * Validates and normalises the pricing configuration edited in the admin panel.
 * Collects every problem and throws a single 422 whose fields are keyed by path (e.g. "tabs.0.plans.1.prices.monthly.amount").
 */
final class PricingValidator
{
    /** Units a price allowance or extra rate can be measured in. */
    public const UNITS = ['', 'min', 'hour', 'km', 'ride', 'seat', 'delivery', 'day', 'week', 'month'];

    private const SLUG = '/^[a-z0-9]+(?:-[a-z0-9]+)*$/';

    /** @var array<string,string> */
    private array $errors = [];

    /** @return array<string,mixed> */
    public function validate(mixed $input): array
    {
        $this->errors = [];
        if (!is_array($input)) {
            $this->fail('data', 'Pricing must be an object.');
            $input = [];
        }

        $clean = [
            'currency' => $this->text($input, 'currency', 'currency', 'Currency', 1, 8),
            'tabs' => [],
            'addOns' => [],
            'paymentMethods' => [],
        ];

        $tabs = $this->items($input, 'tabs', 'tabs', 'Tabs', 8);
        if ($tabs === []) {
            $this->fail('tabs', 'Add at least one pricing tab.');
        }
        $tabIds = [];
        foreach ($tabs as $t => $tab) {
            $clean['tabs'][] = $this->tab(is_array($tab) ? $tab : [], "tabs.$t", $t, $tabIds);
        }

        foreach ($this->items($input, 'addOns', 'addOns', 'Add-ons', 12) as $a => $addOn) {
            $addOn = is_array($addOn) ? $addOn : [];
            $path = "addOns.$a";
            $label = $this->text($addOn, 'label', "$path.label", 'Add-on ' . ($a + 1) . ': name', 1, 60);
            $context = 'Add-on “' . ($label !== '' ? $label : $a + 1) . '”';
            $amount = $this->number($addOn, 'amount', "$path.amount", "$context: price", 10_000_000);
            $customLabel = $this->text($addOn, 'customLabel', "$path.customLabel", "$context: custom label", 0, 30);
            $clean['addOns'][] = [
                'label' => $label,
                'amount' => $amount,
                'customLabel' => $amount === null && $customLabel === '' ? 'Custom' : $customLabel,
                'unit' => $this->unit($addOn, 'unit', "$path.unit", "$context: unit"),
                'note' => $this->text($addOn, 'note', "$path.note", "$context: note", 0, 200),
            ];
        }

        foreach ($this->items($input, 'paymentMethods', 'paymentMethods', 'Payment methods', 12) as $m => $method) {
            if (!is_string($method) || trim($method) === '') {
                continue;
            }
            if (mb_strlen(trim($method)) > 40) {
                $this->fail("paymentMethods.$m", 'Each payment method must be 40 characters or fewer.');
            }
            $clean['paymentMethods'][] = trim($method);
        }

        if ($this->errors !== []) {
            throw HttpException::validation($this->errors, 'Some pricing details need attention.');
        }

        return $clean;
    }

    /**
     * @param array<string,mixed> $tab
     * @param list<string> $tabIds
     * @return array<string,mixed>
     */
    private function tab(array $tab, string $path, int $index, array &$tabIds): array
    {
        $label = $this->text($tab, 'label', "$path.label", 'Tab ' . ($index + 1) . ': label', 1, 40);
        $name = $label !== '' ? "“{$label}” tab" : 'Tab ' . ($index + 1);

        $billing = [];
        $billingIds = [];
        $billingLabels = [];
        foreach ($this->items($tab, 'billing', "$path.billing", "$name: billing options", 4) as $b => $option) {
            $option = is_array($option) ? $option : [];
            $bPath = "$path.billing.$b";
            $optionLabel = $this->text($option, 'label', "$bPath.label", "$name › billing option " . ($b + 1) . ': label', 1, 40);
            $id = $this->slug($option, 'id', "$bPath.id", "$name › billing option " . ($b + 1) . ': ID', $billingIds);
            $billingLabels[$id] = $optionLabel;
            $billing[] = [
                'id' => $id,
                'label' => $optionLabel,
                'badge' => $this->text($option, 'badge', "$bPath.badge", "$name › $optionLabel: badge", 0, 30),
            ];
        }
        $priceKeys = $billing === [] ? ['default'] : array_column($billing, 'id');

        $plans = [];
        $planIds = [];
        $rawPlans = $this->items($tab, 'plans', "$path.plans", "$name: plans", 6);
        if ($rawPlans === []) {
            $this->fail("$path.plans", "$name needs at least one plan.");
        }
        foreach ($rawPlans as $p => $plan) {
            $plan = is_array($plan) ? $plan : [];
            $pPath = "$path.plans.$p";
            $planName = $this->text($plan, 'name', "$pPath.name", "$name › plan " . ($p + 1) . ': name', 1, 60);
            $context = "$name › " . ($planName !== '' ? $planName : 'plan ' . ($p + 1));

            $rawPrices = is_array($plan['prices'] ?? null) ? $plan['prices'] : [];
            $prices = [];
            foreach ($priceKeys as $key) {
                $keyLabel = $key === 'default' ? 'price' : ($billingLabels[$key] ?? $key) . ' price';
                if (!is_array($rawPrices[$key] ?? null)) {
                    $this->fail("$pPath.prices.$key", "$context: add a $keyLabel.");
                    continue;
                }
                $prices[$key] = $this->price($rawPrices[$key], "$pPath.prices.$key", "$context › $keyLabel");
            }

            $link = $this->text($plan, 'ctaLink', "$pPath.ctaLink", "$context: button link", 1, 200);
            if ($link !== '' && preg_match('#^(/|https://)#', $link) !== 1) {
                $this->fail("$pPath.ctaLink", "$context: button link must start with / or https://.");
            }

            $features = [];
            foreach ($this->items($plan, 'features', "$pPath.features", "$context: features", 12) as $f => $feature) {
                if (!is_string($feature) || trim($feature) === '') {
                    continue;
                }
                if (mb_strlen(trim($feature)) > 120) {
                    $this->fail("$pPath.features.$f", "$context: each feature must be 120 characters or fewer.");
                }
                $features[] = trim($feature);
            }

            $plans[] = [
                'id' => $this->slug($plan, 'id', "$pPath.id", "$context: ID", $planIds),
                'name' => $planName,
                'description' => $this->text($plan, 'description', "$pPath.description", "$context: description", 0, 200),
                'popular' => ($plan['popular'] ?? false) === true,
                'ctaLabel' => $this->text($plan, 'ctaLabel', "$pPath.ctaLabel", "$context: button label", 1, 40),
                'ctaLink' => $link,
                'featuresTitle' => $this->text($plan, 'featuresTitle', "$pPath.featuresTitle", "$context: features heading", 0, 80),
                'features' => $features,
                'prices' => $prices,
            ];
        }

        $compare = [];
        foreach ($this->items($tab, 'compare', "$path.compare", "$name: comparison groups", 12) as $g => $group) {
            $group = is_array($group) ? $group : [];
            $gPath = "$path.compare.$g";
            $title = $this->text($group, 'title', "$gPath.title", "$name › comparison group " . ($g + 1) . ': title', 1, 60);
            $rows = [];
            foreach ($this->items($group, 'rows', "$gPath.rows", "$name › $title: rows", 30) as $r => $row) {
                $row = is_array($row) ? $row : [];
                $rPath = "$gPath.rows.$r";
                $rowLabel = $this->text($row, 'label', "$rPath.label", "$name › $title › row " . ($r + 1) . ': label', 1, 80);
                $values = is_array($row['values'] ?? null) ? array_values($row['values']) : [];
                if (count($values) !== count($plans)) {
                    $this->fail("$rPath.values", "$name › $title › " . ($rowLabel !== '' ? $rowLabel : 'row ' . ($r + 1)) . ': needs one value per plan.');
                }

                $cleanValues = [];
                foreach (array_slice(array_pad($values, count($plans), false), 0, count($plans)) as $v => $value) {
                    if (is_bool($value)) {
                        $cleanValues[] = $value;
                    } elseif (is_string($value) || is_int($value) || is_float($value)) {
                        $text = trim((string) $value);
                        if (mb_strlen($text) > 60) {
                            $this->fail("$rPath.values.$v", "$name › $title › $rowLabel: values must be 60 characters or fewer.");
                        }
                        $cleanValues[] = $text === '' ? false : $text;
                    } else {
                        $this->fail("$rPath.values.$v", "$name › $title › $rowLabel: values must be text, yes or no.");
                        $cleanValues[] = false;
                    }
                }
                $rows[] = ['label' => $rowLabel, 'values' => $cleanValues];
            }
            $compare[] = ['title' => $title, 'rows' => $rows];
        }

        return [
            'id' => $this->slug($tab, 'id', "$path.id", "$name: ID", $tabIds),
            'label' => $label,
            'title' => $this->text($tab, 'title', "$path.title", "$name: heading", 0, 120),
            'description' => $this->text($tab, 'description', "$path.description", "$name: description", 0, 240),
            'footnote' => $this->text($tab, 'footnote', "$path.footnote", "$name: footnote", 0, 300),
            'billing' => $billing,
            'plans' => $plans,
            'compare' => $compare,
        ];
    }

    /**
     * @param array<string,mixed> $price
     * @return array<string,mixed>
     */
    private function price(array $price, string $path, string $context): array
    {
        $amount = $this->number($price, 'amount', "$path.amount", "$context: amount", 10_000_000);
        $includedQuantity = $this->number($price, 'includedQuantity', "$path.includedQuantity", "$context: included amount", 1_000_000);
        $includedUnit = $this->unit($price, 'includedUnit', "$path.includedUnit", "$context: included unit");
        $extraRate = $this->number($price, 'extraRate', "$path.extraRate", "$context: extra rate", 1_000_000);
        $extraUnit = $this->unit($price, 'extraUnit', "$path.extraUnit", "$context: extra unit");

        if ($includedQuantity !== null && $includedQuantity > 0 && $includedUnit === '') {
            $this->fail("$path.includedUnit", "$context: choose a unit for the included amount (for example minutes or km).");
        }
        if ($extraRate !== null && $extraUnit === '') {
            $this->fail("$path.extraUnit", "$context: choose what the extra rate is charged per (for example per minute or per km).");
        }

        $customLabel = $this->text($price, 'customLabel', "$path.customLabel", "$context: custom label", 0, 30);

        return [
            'amount' => $amount,
            'customLabel' => $amount === null && $customLabel === '' ? 'Custom' : $customLabel,
            'period' => $this->text($price, 'period', "$path.period", "$context: text after the price", 0, 30),
            'includedQuantity' => $includedQuantity,
            'includedUnit' => $includedUnit,
            'includedPer' => $this->text($price, 'includedPer', "$path.includedPer", "$context: included per", 0, 30),
            'extraRate' => $extraRate,
            'extraUnit' => $extraUnit,
            'note' => $this->text($price, 'note', "$path.note", "$context: note", 0, 120),
        ];
    }

    /**
     * @param array<string,mixed> $data
     * @return array<int,mixed>
     */
    private function items(array $data, string $key, string $path, string $label, int $max): array
    {
        $raw = $data[$key] ?? [];
        if (!is_array($raw) || ($raw !== [] && !array_is_list($raw))) {
            $this->fail($path, "$label must be a list.");
            return [];
        }
        if (count($raw) > $max) {
            $this->fail($path, "$label: no more than $max allowed.");
            return array_slice($raw, 0, $max);
        }

        return $raw;
    }

    /** @param array<string,mixed> $data */
    private function text(array $data, string $key, string $path, string $label, int $min, int $max): string
    {
        $raw = $data[$key] ?? '';
        if (!is_string($raw) && !is_int($raw) && !is_float($raw)) {
            $this->fail($path, "$label must be text.");
            return '';
        }

        $value = trim((string) $raw);
        $length = mb_strlen($value);
        if ($length < $min) {
            $this->fail($path, $min === 1 ? "$label is required." : "$label must be at least $min characters.");
        } elseif ($length > $max) {
            $this->fail($path, "$label must be $max characters or fewer.");
        }

        return $value;
    }

    /** @param array<string,mixed> $data */
    private function number(array $data, string $key, string $path, string $label, int $max): int|float|null
    {
        $raw = $data[$key] ?? null;
        if ($raw === null || $raw === '') {
            return null;
        }
        if (is_bool($raw) || !is_numeric($raw)) {
            $this->fail($path, "$label must be a number.");
            return null;
        }

        $number = round((float) $raw, 2);
        if ($number < 0) {
            $this->fail($path, "$label must be 0 or more.");
            return null;
        }
        if ($number > $max) {
            $this->fail($path, "$label is too large.");
            return null;
        }

        return floor($number) === $number ? (int) $number : $number;
    }

    /** @param array<string,mixed> $data */
    private function unit(array $data, string $key, string $path, string $label): string
    {
        $raw = $data[$key] ?? '';
        if (!is_string($raw) || !in_array($raw, self::UNITS, true)) {
            $this->fail($path, "$label is not a recognised unit.");
            return '';
        }

        return $raw;
    }

    /**
     * @param array<string,mixed> $data
     * @param list<string> $taken
     */
    private function slug(array $data, string $key, string $path, string $label, array &$taken): string
    {
        $value = $this->text($data, $key, $path, $label, 1, 40);
        if ($value !== '' && preg_match(self::SLUG, $value) !== 1) {
            $this->fail($path, "$label can only use lowercase letters, numbers and hyphens.");
        } elseif ($value !== '' && in_array($value, $taken, true)) {
            $this->fail($path, "$label “{$value}” is used more than once.");
        }
        $taken[] = $value;

        return $value;
    }

    private function fail(string $path, string $message): void
    {
        $this->errors[$path] ??= $message;
    }
}
