<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    Cache::flush();
});

test('it returns paginated products successfully', function (): void {
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
                ],
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
            ],
        ]);

    expect($response->json('meta.total'))->toBe(5);
    expect($response->json('data'))->toHaveCount(5);
});

test('it returns empty data when no products exist', function (): void {
    $response = $this->getJson('/api/products');

    $response->assertOk()
        ->assertJson([
            'data' => [],
            'meta' => [
                'total' => 0,
                'current_page' => 1,
            ],
        ]);
});

test('it filters products by categories', function (): void {
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();

    Product::factory()->count(3)->create(['category_id' => $category1->id]);
    Product::factory()->count(2)->create(['category_id' => $category2->id]);

    $response = $this->getJson('/api/products?categories[]='.$category1->id.'&categories[]='.$category2->id);

    $response->assertOk();

    expect($response->json('meta.total'))->toBe(5);

    $allowedCategories = [$category1->title, $category2->title];
    foreach ($response->json('data') as $product) {
        expect($allowedCategories)->toContain($product['category']);
    }
});

test('it filters products by price_min', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]);

    $response = $this->getJson('/api/products?price_min=10');

    $response->assertOk();

    expect($response->json('meta.total'))->toBe(2);

    foreach ($response->json('data') as $product) {
        expect($product['price'])->toBeGreaterThanOrEqual(10);
    }
});

test('it filters products by price_max', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]);

    $response = $this->getJson('/api/products?price_max=10');

    $response->assertOk();

    expect($response->json('meta.total'))->toBe(2);

    foreach ($response->json('data') as $product) {
        expect($product['price'])->toBeLessThanOrEqual(10);
    }
});

test('it filters products by price range', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)
    Product::factory()->create(['price' => 20, 'category_id' => $category->id]); // $20.00 (2000 cents)

    $response = $this->getJson('/api/products?price_min=10&price_max=15');

    $response->assertOk();

    expect($response->json('meta.total'))->toBe(2);

    foreach ($response->json('data') as $product) {
        expect($product['price'])->toBeGreaterThanOrEqual(10)
            ->toBeLessThanOrEqual(15);
    }
});

test('it filters products by search term', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['title' => 'iPhone Case', 'category_id' => $category->id]);
    Product::factory()->create(['title' => 'Samsung Phone', 'category_id' => $category->id]);
    Product::factory()->create(['title' => 'Laptop Stand', 'category_id' => $category->id]);

    $response = $this->getJson('/api/products?search=phone');

    $response->assertOk();

    expect($response->json('meta.total'))->toBe(2);

    foreach ($response->json('data') as $product) {
        expect(mb_strtolower((string) $product['title']))->toContain('phone');
    }
});

test('it combines multiple filters correctly', function (): void {
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();

    Product::factory()->create([
        'title' => 'iPhone Case',
        'price' => 20,
        'category_id' => $category1->id,
    ]);
    Product::factory()->create([
        'title' => 'Phone Charger',
        'price' => 15,
        'category_id' => $category1->id,
    ]);
    Product::factory()->create([
        'title' => 'Phone Stand',
        'price' => 10,
        'category_id' => $category2->id,
    ]);

    $response = $this->getJson(sprintf('/api/products?categories[]=%s&price_max=18&search=phone', $category1->id));

    $response->assertOk();

    expect($response->json('meta.total'))->toBe(1);

    $product = $response->json('data.0');
    expect($product['title'])->toBe('Phone Charger');
    expect($product['category'])->toBe($category1->title);
    expect($product['price'])->toBe(15);
});

test('it returns products ordered by price ascending', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]);

    $response = $this->getJson('/api/products');

    $response->assertOk();

    $prices = collect($response->json('data'))->pluck('price')->toArray();
    expect($prices)->toBe([5, 10, 15]);
});

test('it validates category_id parameter', function (): void {
    $response = $this->getJson('/api/products?categories[]=invalid');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['categories.0']);
});

test('it validates category_id exists in database', function (): void {
    $response = $this->getJson('/api/products?categories[]=999999');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['categories.0']);
});

test('it validates price_min parameter', function (): void {
    $response = $this->getJson('/api/products?price_min=invalid');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_min']);
});

test('it validates price_max parameter', function (): void {
    $response = $this->getJson('/api/products?price_max=invalid');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_max']);
});

test('it validates search parameter length', function (): void {
    $longSearch = str_repeat('a', 256);
    $response = $this->getJson('/api/products?search='.$longSearch);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['search']);
});

test('it handles negative price_min gracefully', function (): void {
    $response = $this->getJson('/api/products?price_min=-100');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_min']);
});

test('it handles zero price_max gracefully', function (): void {
    $response = $this->getJson('/api/products?price_max=0');

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_max']);
});

test('it caches products for one hour', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    // First request
    $response1 = $this->getJson('/api/products');
    $response1->assertOk();

    // Verify cache was set (cache key is based on filters)
    $filters = [];
    $cacheKey = 'products_'.md5(json_encode($filters));
    expect(Cache::has($cacheKey))->toBe(true);

    // Second request should use cache
    $startTime = microtime(true);
    $response2 = $this->getJson('/api/products');
    $executionTime = microtime(true) - $startTime;

    $response2->assertOk();
    expect($executionTime)->toBeLessThan(0.1); // Should be very fast due to caching
});

test('it supports pagination with page parameter', function (): void {
    $category = Category::factory()->create();
    Product::factory()->count(20)->create(['category_id' => $category->id]);

    $response = $this->getJson('/api/products?page=2');

    $response->assertOk();

    expect($response->json('meta.current_page'))->toBe(2);
    expect($response->json('meta.total'))->toBe(20);
    expect($response->json('data'))->toHaveCount(6);
});

test('it includes correct product resource fields', function (): void {
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

test('it handles concurrent requests properly', function (): void {
    $category = Category::factory()->create();
    Product::factory()->count(10)->create(['category_id' => $category->id]);

    // Simulate concurrent requests
    $responses = [];
    for ($i = 0; $i < 5; ++$i) {
        $responses[] = $this->getJson('/api/products');
    }

    foreach ($responses as $response) {
        $response->assertOk();
        expect($response->json('meta.total'))->toBe(10);
    }
});

test('it returns 405 for unsupported HTTP methods', function (): void {
    $methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

    foreach ($methods as $method) {
        $response = $this->call($method, '/api/products');
        $response->assertMethodNotAllowed();
    }
});

test('it accepts json content type', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    $response = $this->json('GET', '/api/products', [], [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ]);

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/json');
});

test('it handles empty filter parameters', function (): void {
    $category = Category::factory()->create();
    Product::factory()->count(3)->create(['category_id' => $category->id]);

    $response = $this->getJson('/api/products?categories[]=&price_min=&price_max=&search=');

    $response->assertOk();

    expect($response->json('meta.total'))->toBe(3);
});

test('it measures performance under load', function (): void {
    $category = Category::factory()->create();
    Product::factory()->count(50)->create(['category_id' => $category->id]);

    $startTime = microtime(true);
    $response = $this->getJson('/api/products');
    $executionTime = microtime(true) - $startTime;

    $response->assertOk();
    expect($executionTime)->toBeLessThan(1.0); // Should complete within 1 second
});

test('it returns consistent response structure across different filters', function (): void {
    $category = Category::factory()->create();
    Product::factory()->count(3)->create(['category_id' => $category->id]);

    $endpoints = [
        '/api/products',
        '/api/products?categories[]='.$category->id,
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
                    ],
                ],
                'links',
                'meta',
            ]);
    }
});

// Min-Max Price API Tests
test('it returns min and max prices when products exist', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 20, 'category_id' => $category->id]);

    $response = $this->getJson('/api/products/min-max-price');

    $response->assertOk()
        ->assertJsonStructure([
            'min_price',
            'max_price',
        ])
        ->assertJson([
            'min_price' => 5,
            'max_price' => 20,
        ]);
});

test('it returns zero for both min and max when no products exist', function (): void {
    $response = $this->getJson('/api/products/min-max-price');

    $response->assertOk()
        ->assertJson([
            'min_price' => 0,
            'max_price' => 0,
        ]);
});

test('it returns same value for min and max when only one product exists', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 100, 'category_id' => $category->id]);

    $response = $this->getJson('/api/products/min-max-price');

    $response->assertOk()
        ->assertJson([
            'min_price' => 100,
            'max_price' => 100,
        ]);
});

test('it handles decimal prices correctly for min-max endpoint', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 9.99, 'category_id' => $category->id]); // $9.99 -> (int) 9.99 = 9
    Product::factory()->create(['price' => 15.99, 'category_id' => $category->id]); // $15.99 -> (int) 15.99 = 15

    $response = $this->getJson('/api/products/min-max-price');

    $response->assertOk()
        ->assertJson([
            'min_price' => 9, // Truncated by price mutator
            'max_price' => 15, // Truncated by price mutator
        ]);
});

test('it returns correct types for min and max prices in response', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 50, 'category_id' => $category->id]);

    $response = $this->getJson('/api/products/min-max-price');

    $response->assertOk();

    $data = $response->json();
    expect($data['min_price'])->toBeNumeric();
    expect($data['max_price'])->toBeNumeric();
});

test('it finds correct min and max with many products for api endpoint', function (): void {
    $category = Category::factory()->create();
    $prices = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100, 200, 300, 500];

    foreach ($prices as $price) {
        Product::factory()->create(['price' => $price, 'category_id' => $category->id]);
    }

    $response = $this->getJson('/api/products/min-max-price');

    $response->assertOk()
        ->assertJson([
            'min_price' => 1,
            'max_price' => 500,
        ]);
});

test('it caches min-max prices for one hour', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 100, 'category_id' => $category->id]);

    // First request
    $response1 = $this->getJson('/api/products/min-max-price');
    $response1->assertOk();

    // Verify cache was set
    expect(Cache::has('min_max_products_price'))->toBe(true);

    // Second request should use cache
    $startTime = microtime(true);
    $response2 = $this->getJson('/api/products/min-max-price');
    $executionTime = microtime(true) - $startTime;

    $response2->assertOk();
    expect($executionTime)->toBeLessThan(0.1); // Should be very fast due to caching
});

test('it returns 405 for unsupported HTTP methods on min-max endpoint', function (): void {
    $methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

    foreach ($methods as $method) {
        $response = $this->call($method, '/api/products/min-max-price');
        $response->assertMethodNotAllowed();
    }
});

test('it accepts json content type for min-max endpoint', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 100, 'category_id' => $category->id]);

    $response = $this->json('GET', '/api/products/min-max-price', [], [
        'Content-Type' => 'application/json',
        'Accept' => 'application/json',
    ]);

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/json')
        ->assertJson([
            'min_price' => 100,
            'max_price' => 100,
        ]);
});

test('it measures performance under load for min-max endpoint', function (): void {
    $category = Category::factory()->create();
    Product::factory()->count(1000)->create(['category_id' => $category->id]);

    $startTime = microtime(true);
    $response = $this->getJson('/api/products/min-max-price');
    $executionTime = microtime(true) - $startTime;

    $response->assertOk();
    expect($executionTime)->toBeLessThan(1.0); // Should complete within 1 second
});
