<?php

declare(strict_types=1);

use App\Actions\Catalog\Products\GetMinMaxProductsPriceAction;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;


beforeEach(function (): void {
    $this->action = new GetMinMaxProductsPriceAction();
});

test('it can be instantiated', function (): void {
    expect($this->action)->toBeInstanceOf(GetMinMaxProductsPriceAction::class);
});

test('it returns min and max prices when products exist', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 5, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 10, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 15, 'category_id' => $category->id]);
    Product::factory()->create(['price' => 20, 'category_id' => $category->id]);

    $result = $this->action->execute();

    expect($result)->toBeArray();
    expect($result)->toHaveKeys(['min_price', 'max_price']);
    expect($result['min_price'])->toBe(5);
    expect($result['max_price'])->toBe(20);
});

test('it returns zero for both min and max when no products exist', function (): void {
    $result = $this->action->execute();

    expect($result)->toBeArray();
    expect($result)->toHaveKeys(['min_price', 'max_price']);
    expect($result['min_price'])->toBe(0);
    expect($result['max_price'])->toBe(0);
});

test('it returns same value for min and max when only one product exists', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 100, 'category_id' => $category->id]);

    $result = $this->action->execute();

    expect($result)->toBeArray();
    expect($result)->toHaveKeys(['min_price', 'max_price']);
    expect($result['min_price'])->toBe(100);
    expect($result['max_price'])->toBe(100);
});

test('it handles decimal prices correctly', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 9.99, 'category_id' => $category->id]); // $9.99
    Product::factory()->create(['price' => 15.99, 'category_id' => $category->id]); // $15.99

    $result = $this->action->execute();

    expect($result)->toBeArray();
    expect($result)->toHaveKeys(['min_price', 'max_price']);
    expect($result['min_price'])->toBe(9.99);
    expect($result['max_price'])->toBe(15.99);
});

test('it returns correct types for min and max prices', function (): void {
    $category = Category::factory()->create();
    Product::factory()->create(['price' => 50, 'category_id' => $category->id]);

    $result = $this->action->execute();

    expect($result['min_price'])->toBeInt();
    expect($result['max_price'])->toBeInt();
});

test('it finds correct min and max with many products', function (): void {
    $category = Category::factory()->create();
    $prices = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100, 200, 300, 500];
    
    foreach ($prices as $price) {
        Product::factory()->create(['price' => $price, 'category_id' => $category->id]);
    }

    $result = $this->action->execute();

    expect($result)->toBeArray();
    expect($result)->toHaveKeys(['min_price', 'max_price']);
    expect($result['min_price'])->toBe(1);
    expect($result['max_price'])->toBe(500);
}); 