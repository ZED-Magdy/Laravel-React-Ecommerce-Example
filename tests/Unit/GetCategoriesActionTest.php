<?php

declare(strict_types=1);

use App\Actions\Catalog\Categories\GetCategoriesAction;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;


test('can retrieve all categories', function (): void {
    // Arrange
    $categories = Category::factory()->count(3)->create();
    $action = new GetCategoriesAction();

    // Act
    $result = $action->execute();

    // Assert
    expect($result)
        ->toHaveCount(3)
        ->each->toBeInstanceOf(Category::class);

    // Check that all created categories are present
    $categoryIds = $result->pluck('id')->toArray();
    foreach ($categories as $category) {
        expect($categoryIds)->toContain($category->id);
    }
});

test('returns empty collection when no categories exist', function (): void {
    // Arrange
    $action = new GetCategoriesAction();

    // Act
    $result = $action->execute();

    // Assert
    expect($result)
        ->toHaveCount(0)
        ->toBeEmpty();
});

test('returns only id and title fields', function (): void {
    // Arrange
    Category::factory()->create([
        'title' => 'Electronics',
    ]);
    $action = new GetCategoriesAction();

    // Act
    $result = $action->execute();

    // Assert
    expect($result)->toHaveCount(1);

    $category = $result->first();
    expect($category)
        ->toHaveKeys(['id', 'title'])
        ->not()->toHaveKey('created_at')
        ->not()->toHaveKey('updated_at');

    expect($category->title)->toBe('Electronics');
    expect($category->id)->toBeInt();
});

test('handles large number of categories efficiently', function (): void {
    // Arrange
    Category::factory()->count(100)->create();
    $action = new GetCategoriesAction();

    // Act
    $startTime = microtime(true);
    $result = $action->execute();
    $executionTime = microtime(true) - $startTime;

    // Assert
    expect($result)->toHaveCount(100);
    expect($executionTime)->toBeLessThan(0.1); // Should execute in less than 100ms
});

test('returns categories in consistent order', function (): void {
    // Arrange
    $category1 = Category::factory()->create(['title' => 'First']);
    $category2 = Category::factory()->create(['title' => 'Second']);
    $category3 = Category::factory()->create(['title' => 'Third']);

    $action = new GetCategoriesAction();

    // Act - Execute multiple times
    $result1 = $action->execute();
    $result2 = $action->execute();

    // Assert - Results should be consistent
    expect($result1->pluck('id')->toArray())
        ->toBe($result2->pluck('id')->toArray());
});

test('action can be instantiated without dependencies', function (): void {
    // Act
    $action = new GetCategoriesAction();

    // Assert
    expect($action)->toBeInstanceOf(GetCategoriesAction::class);
});
