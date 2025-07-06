<?php

declare(strict_types=1);

use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->products = Product::factory()->count(2)->create(['price' => 1000, 'stock' => 20]);
});

test('can checkout successfully', function (): void {
    Sanctum::actingAs($this->user);
    $items = $this->products->map(fn ($p): array => ['product_id' => $p->id, 'quantity' => 2])->toArray();
    $response = $this->postJson('/api/checkout', ['items' => $items]);
    $response->assertCreated()->assertJsonStructure(['id', 'subtotal', 'shipping', 'tax', 'total', 'items']);
    expect($response->json('items'))->toHaveCount(2);
});

test('checkout fails with invalid product', function (): void {
    Sanctum::actingAs($this->user);
    $response = $this->postJson('/api/checkout', ['items' => [['product_id' => 999999, 'quantity' => 1]]]);
    $response->assertUnprocessable();
});

test('checkout requires authentication', function (): void {
    $items = $this->products->map(fn ($p): array => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    $response = $this->postJson('/api/checkout', ['items' => $items]);
    $response->assertUnauthorized();
});

test('can get order details', function (): void {
    Sanctum::actingAs($this->user);
    $items = $this->products->map(fn ($p): array => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    $orderId = $this->postJson('/api/checkout', ['items' => $items])->json('id');
    $response = $this->getJson('/api/orders/'.$orderId);
    $response->assertOk()
        ->assertJsonStructure(['id', 'subtotal', 'shipping', 'tax', 'total', 'items']);
});

test('cannot get order details of another user', function (): void {
    Sanctum::actingAs($this->user);
    $items = $this->products->map(fn ($p): array => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    $orderId = $this->postJson('/api/checkout', ['items' => $items])->json('id');
    $otherUser = User::factory()->create();
    Sanctum::actingAs($otherUser);
    $response = $this->getJson('/api/orders/'.$orderId);
    $response->assertNotFound();
});

test('can get paginated orders list', function (): void {
    Sanctum::actingAs($this->user);
    $items = $this->products->map(fn ($p): array => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    foreach (range(1, 12) as $i) {
        $this->postJson('/api/checkout', ['items' => $items]);
    }

    $response = $this->getJson('/api/orders');
    $response->assertOk()->assertJsonStructure(['data', 'links', 'meta']);
    expect($response->json('meta.total'))->toBeGreaterThanOrEqual(12);
    expect($response->json('data'))->toHaveCount(10);
});

test('orders endpoints require authentication', function (): void {
    $response = $this->getJson('/api/orders');
    $response->assertUnauthorized();
    $response = $this->getJson('/api/orders/1');
    $response->assertUnauthorized();
});
