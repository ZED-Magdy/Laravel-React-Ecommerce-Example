<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final readonly class CalculateCartAction
{
    /**
     * Execute the checkout action.
     *
     * @param array{
     *     items: array<array{
     *         product_id: int,
     *         quantity: int,
     *     }>,
     * } $data
     * 
     * @return array{
     *     subtotal: int,
     *     shipping: int,
     *     tax: float,
     *     total: int,
     * }
     */
    public function execute(array $data): array
    {
        $productIds = collect($data['items'])->pluck('product_id')->toArray();
        $products = Product::query()->whereIn('id', $productIds)->get();
        if ($products->isEmpty()) {
            return [
                'subtotal' => 0,
                'shipping' => 0,
                'tax' => 0,
                'total' => 0,
            ];
        }
        throw_if($products->count() !== count($productIds), new Exception('Invalid product IDs'));

        $subtotal = $products->sum(function (Product $product) use ($data): int {
            $item = array_filter($data['items'], fn ($item): bool => $item['product_id'] === $product->id);
            $item = reset($item);
            throw_unless($item, new Exception('Invalid product ID'));
            throw_if($item['quantity'] <= 0, new Exception('Invalid quantity'));

            return $product->price * $item['quantity'];
        });

        /** @var int $shipping */
        $shipping = config('order.shipping_in_cents');
        /** @var float $taxRate */
        $taxRate = config('order.tax_rate');
        $tax = $subtotal * $taxRate / 100;
        $total = $subtotal + $shipping + $tax;

        return [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
        ];
    }
}
