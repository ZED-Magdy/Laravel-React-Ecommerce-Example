<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final readonly class CheckoutAction
{
    public function __construct(private GetNextOrderNumberAction $getNextOrderNumberAction) {}

    /**
     * Execute the checkout action.
     *
     * @param array{
     *     user_id: int,
     *     items: array<array{
     *         product_id: int,
     *         quantity: int,
     *     }>,
     * } $data
     */
    public function execute(array $data): Order
    {
        try {
            return DB::transaction(function () use ($data) {
                $productIds = collect($data['items'])->pluck('product_id')->toArray();
                $products = Product::query()->whereIn('id', $productIds)->get();
                throw_if($products->isEmpty() || $products->count() !== count($productIds), new Exception('Invalid product IDs'));

                $subtotal = $products->sum(function (Product $product) use ($data): int {
                    $item = array_filter($data['items'], fn ($item): bool => $item['product_id'] === $product->id);
                    $item = reset($item);
                    throw_unless($item, new Exception('Invalid product ID'));

                    return $product->price * $item['quantity'];
                });

                /** @var int $shipping */
                $shipping = config('order.shipping_in_cents', 1500) / 100;
                /** @var float $taxRate */
                $taxRate = config('order.tax_rate', 15);
                $tax = $subtotal * $taxRate / 100;
                $total = $subtotal + $shipping + $tax;

                $orderNumber = $this->getNextOrderNumberAction->execute();

                /** @var Order $order */
                $order = Order::query()->create([
                    'user_id' => $data['user_id'],
                    'subtotal' => $subtotal,
                    'shipping' => $shipping,
                    'tax' => $tax,
                    'total' => $total,
                    'order_number' => $orderNumber,
                ]);

                foreach ($data['items'] as $item) {
                    $product = $products->firstWhere('id', $item['product_id']);
                    throw_unless($product, new Exception('Invalid product ID'));

                    throw_if($item['quantity'] <= 0, new Exception('Invalid quantity'));
                    throw_if($product->stock < $item['quantity'], new Exception('Insufficient stock'));
                    $total = $product->price * $item['quantity'];
                    $order->items()->create([
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'title' => $product->title,
                        'image_url' => $product->getFirstMediaUrl('thumbnail'),
                        'price' => $product->price,
                        'total' => $total,
                    ]);

                    $product->decrement('stock', $item['quantity']);
                }

                Cache::tags('products')->flush();
                Cache::forget('min_max_products_price');
                Cache::put('order_'.$order->id.'_'.$data['user_id'], $order->load('items'), now()->addHour());
                Cache::forget('orders_'.$data['user_id']);
                Cache::put('next_order_number', $orderNumber + 1, now()->addHour());

                return $order;
            });
        } catch (Exception) {
            throw new Exception('Failed to checkout');
        }
    }
}
