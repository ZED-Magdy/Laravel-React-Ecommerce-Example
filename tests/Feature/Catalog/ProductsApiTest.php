<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

uses(RefreshDatabase::class);

beforeEach(function () {
    Cache::flush();
});

test('it returns paginated products successfully', function () {
    $category = Category::factory()->create();
    Product::factory()->count(5)->create(['category_id' => $category->id]);

    $response = $this->getJson('/api/products');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'price',
                    'category',
                    'stock',
                    'thumbnail',
                ]
            ],
            'links' => [
                'first',
                'last',
                'prev',
                'next',
            ],
            'meta' => [
                'current_page',
                'from',
                'last_page',
                'per_page',
                'to',
                'total',
            ]
        ]);

    expect($response->json('meta.total'))->toBe(5);
    expect($response->json('data'))->toHaveCount(5);
});

test('it returns empty data when no products exist', function () {
    $response = $this->getJson('/api/products');

    $response->assertOk()
        ->assertJson([
            'data' => [],
            'meta' => [
                'total' => 0,
                'current_page' => 1,
            ]
        ]);
});

test('it filters products by category_id', function () {
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();
    
    Product::factory()->count(3)->create(['category_id' => $category1->id]);
    Product::factory()->count(2)->create(['category_id' => $category2->id]);

    $response = $this->getJson("/api/products?category_id={$category1->id}");

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(3);
    
    foreach ($response->json('data') as $product) {
        expect($product['category'])->toBe($category1->title);
    }
});

test('it filters products by price_min', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)

    $response = $this->getJson('/api/products?price_min=1000');

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(2);
    
    foreach ($response->json('data') as $product) {
        expect($product['price'])->toBeGreaterThanOrEqual(10);
    }
});

test('it filters products by price_max', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)

    $response = $this->getJson('/api/products?price_max=1000');

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(2);
    
    foreach ($response->json('data') as $product) {
        expect($product['price'])->toBeLessThanOrEqual(10);
    }
});

test('it filters products by price range', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)
    Product::factory()->create(['price' => 20, 'category_id' => $category->id]); // $20.00 (2000 cents)

    $response = $this->getJson('/api/products?price_min=1000&price_max=1500');

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(2);
    
    foreach ($response->json('data') as $product) {
        expect($product['price'])->toBeGreaterThanOrEqual(10)
                                 ->toBeLessThanOrEqual(15);
    }
});

test('it filters products by search term', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['title' => 'iPhone Case', 'category_id' => $category->id]);
    Product::factory()->create(['title' => 'Samsung Phone', 'category_id' => $category->id]);
    Product::factory()->create(['title' => 'Laptop Stand', 'category_id' => $category->id]);

    $response = $this->getJson('/api/products?search=phone');

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(2);
    
    foreach ($response->json('data') as $product) {
        expect(strtolower($product['title']))->toContain('phone');
    }
});

test('it combines multiple filters correctly', function () {
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();
    
    Product::factory()->create([
        'title' => 'iPhone Case',
        'price' => 20, // $20.00 (2000 cents)
        'category_id' => $category1->id
    ]);
    Product::factory()->create([
        'title' => 'Phone Charger',
        'price' => 15, // $15.00 (1500 cents)
        'category_id' => $category1->id
    ]);
    Product::factory()->create([
        'title' => 'Phone Stand',
        'price' => 10, // $10.00 (1000 cents)
        'category_id' => $category2->id
    ]);

    $response = $this->getJson("/api/products?category_id={$category1->id}&price_max=1800&search=phone");

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(1);
    
    $product = $response->json('data.0');
    expect($product['title'])->toBe('Phone Charger');
    expect($product['category'])->toBe($category1->title);
    expect($product['price'])->toBe(15);
});

test('it returns products ordered by price ascending', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)

    $response = $this->getJson('/api/products');

    $response->assertOk();
    $prices = collect($response->json('data'))->pluck('price')->toArray();
    expect($prices)->toBe([5, 10, 15]);
});

test('it validates category_id parameter', function () {
    $response = $this->getJson('/api/products?category_id=invalid');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['category_id']);
});

test('it validates category_id exists in database', function () {
    $response = $this->getJson('/api/products?category_id=999999');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['category_id']);
});

test('it validates price_min parameter', function () {
    $response = $this->getJson('/api/products?price_min=invalid');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_min']);
});

test('it validates price_max parameter', function () {
    $response = $this->getJson('/api/products?price_max=invalid');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_max']);
});

test('it validates search parameter length', function () {
    $longSearch = str_repeat('a', 256);
    $response = $this->getJson("/api/products?search={$longSearch}");

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['search']);
});

test('it handles negative price_min gracefully', function () {
    $response = $this->getJson('/api/products?price_min=-100');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_min']);
});

test('it handles zero price_max gracefully', function () {
    $response = $this->getJson('/api/products?price_max=0');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_max']);
});

test('it caches products for one hour', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    // First request
    $response1 = $this->getJson('/api/products');
    $response1->assertOk();

    // Verify cache was set (cache key is based on filters)
    $filters = ['category_id' => null, 'price_min' => null, 'price_max' => null, 'search' => null];
    $cacheKey = 'products_' . md5(json_encode($filters));
    expect(Cache::has($cacheKey))->toBe(true);

    // Second request should use cache
    $startTime = microtime(true);
    $response2 = $this->getJson('/api/products');
    $executionTime = microtime(true) - $startTime;

    $response2->assertOk();
    expect($executionTime)->toBeLessThan(0.1); // Should be very fast due to caching
});

test('it supports pagination with page parameter', function () {
    $category = Category::factory()->create();
    Product::factory()->count(20)->create(['category_id' => $category->id]);

    $response = $this->getJson('/api/products?page=2');

    $response->assertOk();
    expect($response->json('meta.current_page'))->toBe(2);
    expect($response->json('meta.total'))->toBe(20);
    expect($response->json('data'))->toHaveCount(6);
});

test('it includes correct product resource fields', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->getJson('/api/products');

    $response->assertOk();
    $productData = $response->json('data.0');
    
    expect($productData)->toHaveKeys([
        'id',
        'title',
        'price',
        'category',
        'stock',
        'thumbnail',
    ]);
    
    expect($productData['id'])->toBe($product->id);
    expect($productData['title'])->toBe($product->title);
    expect($productData['price'])->toBe($product->price);
    expect($productData['category'])->toBe($product->category->title);
    expect($productData['stock'])->toBe($product->stock);
});

test('it handles concurrent requests properly', function () {
    $category = Category::factory()->create();
    Product::factory()->count(10)->create(['category_id' => $category->id]);

    // Simulate concurrent requests
    $responses = [];
    for ($i = 0; $i < 5; $i++) {
        $responses[] = $this->getJson('/api/products');
    }

    foreach ($responses as $response) {
        $response->assertOk();
        expect($response->json('meta.total'))->toBe(10);
    }
});

test('it returns 405 for unsupported HTTP methods', function () {
    $methods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    
    foreach ($methods as $method) {
        $response = $this->call($method, '/api/products');
        $response->assertMethodNotAllowed();
    }
});

test('it accepts json content type', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    $response = $this->json('GET', '/api/products', [], [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ]);

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/json');
});

test('it handles empty filter parameters', function () {
    $category = Category::factory()->create();
    Product::factory()->count(3)->create(['category_id' => $category->id]);

    $response = $this->getJson('/api/products?category_id=&price_min=&price_max=&search=');

    $response->assertOk();
    expect($response->json('meta.total'))->toBe(3);
});

test('it measures performance under load', function () {
    $category = Category::factory()->create();
    Product::factory()->count(50)->create(['category_id' => $category->id]);

    $startTime = microtime(true);
    $response = $this->getJson('/api/products');
    $executionTime = microtime(true) - $startTime;

    $response->assertOk();
    expect($executionTime)->toBeLessThan(1.0); // Should complete within 1 second
});

test('it returns consistent response structure across different filters', function () {
    $category = Category::factory()->create();
    Product::factory()->count(3)->create(['category_id' => $category->id]);

    $endpoints = [
        '/api/products',
        "/api/products?category_id={$category->id}",
        '/api/products?price_min=100',
        '/api/products?search=test',
    ];

    foreach ($endpoints as $endpoint) {
        $response = $this->getJson($endpoint);
        
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'price',
                        'category',
                        'stock',
                        'thumbnail',
                    ]
                ],
                'links',
                'meta',
            ]);
    }
}); 