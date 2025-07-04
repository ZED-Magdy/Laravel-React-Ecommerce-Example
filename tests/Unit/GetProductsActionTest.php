<?php

declare(strict_types=1);

use App\Actions\Catalog\Products\GetProductsAction;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Pagination\LengthAwarePaginator;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->action = new GetProductsAction();
});

test('it can be instantiated', function () {
    expect($this->action)->toBeInstanceOf(GetProductsAction::class);
});

test('it returns paginated products with no filters', function () {
    $category = Category::factory()->create();
    Product::factory()->count(5)->create(['category_id' => $category->id]);

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => null,
        'price_max' => null,
        'search' => null,
    ]);

    expect($result)->toBeInstanceOf(LengthAwarePaginator::class);
    expect($result->total())->toBe(5);
    expect($result->items())->toHaveCount(5);
});

test('it filters products by category', function () {
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();
    
    Product::factory()->count(3)->create(['category_id' => $category1->id]);
    Product::factory()->count(2)->create(['category_id' => $category2->id]);

    $result = $this->action->execute([
        'category_id' => $category1->id,
        'price_min' => null,
        'price_max' => null,
        'search' => null,
    ]);

    expect($result->total())->toBe(3);
    expect($result->items())->each->toBeInstanceOf(Product::class);
    foreach ($result->items() as $product) {
        expect($product->category_id)->toBe($category1->id);
    }
});

test('it filters products by minimum price', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => 1000, // 1000 cents ($10.00) minimum
        'price_max' => null,
        'search' => null,
    ]);

    expect($result->total())->toBe(2);
    foreach ($result->items() as $product) {
        expect($product->price)->toBeGreaterThanOrEqual(10);
    }
});

test('it filters products by maximum price', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => null,
        'price_max' => 1000, // 1000 cents ($10.00) maximum
        'search' => null,
    ]);

    expect($result->total())->toBe(2);
    foreach ($result->items() as $product) {
        expect($product->price)->toBeLessThanOrEqual(10);
    }
});

test('it filters products by price range', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]); // $5.00 (500 cents)
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]); // $10.00 (1000 cents)
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]); // $15.00 (1500 cents)
    Product::factory()->create(['price' => 20, 'category_id' => $category->id]); // $20.00 (2000 cents)

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => 1000, // 1000 cents ($10.00) minimum
        'price_max' => 1500, // 1500 cents ($15.00) maximum
        'search' => null,
    ]);

    expect($result->total())->toBe(2);
    foreach ($result->items() as $product) {
        expect($product->price)->toBeGreaterThanOrEqual(10);
        expect($product->price)->toBeLessThanOrEqual(15);
    }
});

test('it filters products by search term', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['title' => 'iPhone Case', 'category_id' => $category->id]);
    Product::factory()->create(['title' => 'Samsung Phone', 'category_id' => $category->id]);
    Product::factory()->create(['title' => 'Laptop Stand', 'category_id' => $category->id]);

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => null,
        'price_max' => null,
        'search' => 'phone',
    ]);

    expect($result->total())->toBe(2);
    foreach ($result->items() as $product) {
        expect(strtolower($product->title))->toContain('phone');
    }
});

test('it combines multiple filters', function () {
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();
    
    // Products in category 1
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
    
    // Products in category 2 (should be filtered out)
    Product::factory()->create([
        'title' => 'Phone Stand',
        'price' => 10, // $10.00 (1000 cents)
        'category_id' => $category2->id
    ]);

    $result = $this->action->execute([
        'category_id' => $category1->id,
        'price_min' => null,
        'price_max' => 1800, // 1800 cents ($18.00) maximum
        'search' => 'phone',
    ]);

    expect($result->total())->toBe(1);
    $product = $result->items()[0];
    expect($product->title)->toBe('Phone Charger');
    expect($product->category_id)->toBe($category1->id);
    expect($product->price)->toBe(15);
});

test('it orders products by price ascending', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]);

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => null,
        'price_max' => null,
        'search' => null,
    ]);

    $prices = collect($result->items())->pluck('price')->toArray();
    expect($prices)->toBe([5, 10, 15]);
});

test('it returns empty paginator when no products match filters', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['title' => 'iPhone', 'category_id' => $category->id]);

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => null,
        'price_max' => null,
        'search' => 'nonexistent',
    ]);

    expect($result->total())->toBe(0);
    expect($result->items())->toBeEmpty();
});

test('it handles pagination correctly', function () {
    $category = Category::factory()->create();
    Product::factory()->count(25)->create(['category_id' => $category->id]);

    $result = $this->action->execute([
        'category_id' => null,
        'price_min' => null,
        'price_max' => null,
        'search' => null,
    ]);

    expect($result->total())->toBe(25);
    expect($result->perPage())->toBe(6);
    expect($result->currentPage())->toBe(1);
    expect($result->hasPages())->toBe(true);
    expect($result->hasMorePages())->toBe(true);
});

test('it handles edge case with null category_id filter', function () {
    $category = Category::factory()->create();
    Product::factory()->count(3)->create(['category_id' => $category->id]);

    $result = $this->action->execute([
        'category_id' => 0, // Should be treated as falsy
        'price_min' => null,
        'price_max' => null,
        'search' => null,
    ]);

    expect($result->total())->toBe(3);
});

test('it handles performance with large datasets', function () {
    $category = Category::factory()->create();
    Product::factory()->count(100)->create(['category_id' => $category->id]);

    $startTime = microtime(true);
    
    $result = $this->action->execute([
        'category_id' => $category->id,
        'price_min' => null,
        'price_max' => null,
        'search' => null,
    ]);
    
    $executionTime = microtime(true) - $startTime;

    expect($result->total())->toBe(100);
    expect($executionTime)->toBeLessThan(1.0); // Should execute within 1 second
}); 