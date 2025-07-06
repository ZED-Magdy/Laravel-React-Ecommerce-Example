<?php

use App\Actions\Orders\CalculateCartAction;
use App\Models\Product;

test('it calculates cart totals correctly', function () {
    // Create test products
    $product1 = Product::factory()->create(['price' => 1000]); // $10.00
    $product2 = Product::factory()->create(['price' => 2000]); // $20.00

    $action = new CalculateCartAction();

    $result = $action->execute([
        'items' => [
            ['product_id' => $product1->id, 'quantity' => 2],
            ['product_id' => $product2->id, 'quantity' => 1],
        ],
    ]);

    $subtotal = $product1->price * 2 + $product2->price * 1;
    $shipping = config('order.shipping_in_cents', 1500);
    $tax = $subtotal * config('order.tax_rate', 15) / 100;
    $total = $subtotal + $shipping + $tax;

    expect($result)
        ->toBeArray()
        ->toHaveKeys(['subtotal', 'shipping', 'tax', 'total'])
        ->and($result['subtotal'])->toBe($subtotal)
        ->and($result['shipping'])->toBe($shipping)
        ->and($result['tax'])->toBe($tax)
        ->and($result['total'])->toBe($total);
});

test('it returns zero totals for empty cart', function () {
    $action = new CalculateCartAction();

    $result = $action->execute([
        'items' => [],
    ]);

    expect($result)
        ->toBeArray()
        ->toHaveKeys(['subtotal', 'shipping', 'tax', 'total'])
        ->and($result['subtotal'])->toBe(0)
        ->and($result['shipping'])->toBe(0)
        ->and($result['tax'])->toBe(0)
        ->and($result['total'])->toBe(0);
});