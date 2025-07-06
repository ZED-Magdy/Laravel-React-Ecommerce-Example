<?php

use App\Models\Product;

test('it calculates cart totals correctly', function () {
    // Create test products
    $product1 = Product::factory()->create(['price' => 1000]); // $10.00
    $product2 = Product::factory()->create(['price' => 2000]); // $20.00

    // Calculate cart with multiple items
    $response = $this->postJson('/api/calculate-cart', [
        'items' => [
            ['product_id' => $product1->id, 'quantity' => 2],
            ['product_id' => $product2->id, 'quantity' => 1],
        ],
    ]);

    $subtotal = $product1->price * 2 + $product2->price * 1;
    $shipping = config('order.shipping_in_cents', 1500) / 100;
    $tax = $subtotal * config('order.tax_rate', 15) / 100;
    $total = $subtotal + $shipping + $tax;

    $response->assertOk()
        ->assertJsonStructure([
            'subtotal',
            'shipping',
            'tax',
            'total',
        ])
        ->assertJson([
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
        ]);
});

test('it validates invalid product ids', function () {
    $response = $this->postJson('/api/calculate-cart', [
        'items' => [
            ['product_id' => 99999, 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['items.0.product_id']);
});

test('it validates invalid quantities', function () {
    $product = Product::factory()->create();

    $response = $this->postJson('/api/calculate-cart', [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 0],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['items.0.quantity']);
});

test('it handles empty cart', function () {
    $response = $this->postJson('/api/calculate-cart', [
        'items' => [],
    ]);

    $response->assertOk()
        ->assertJson([
            'subtotal' => 0,
            'shipping' => 0,
            'tax' => 0,
            'total' => 0,
        ]);
}); 