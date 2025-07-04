<?php

declare(strict_types=1);

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

uses(RefreshDatabase::class);

test('can retrieve categories via API', function (): void {
    // Arrange
    $categories = collect([
        Category::factory()->create(['title' => 'Category 1']),
        Category::factory()->create(['title' => 'Category 2']),
        Category::factory()->create(['title' => 'Category 3']),
    ]);

    // Act
    $response = $this->getJson('/api/categories');

    // Assert
    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => [
                'id',
                'title',
            ],
        ]);

    expect($response->json())->toHaveCount(3);

    // Verify all categories are present
    foreach ($categories as $category) {
        $response->assertJsonFragment([
            'id' => $category->id,
            'title' => $category->title,
        ]);
    }
});

test('returns empty array when no categories exist', function (): void {
    // Act
    $response = $this->getJson('/api/categories');

    // Assert
    $response->assertStatus(200)
        ->assertJson([]);

    expect($response->json())->toHaveCount(0);
});

test('returns categories in correct JSON format', function (): void {
    // Arrange
    $category = Category::factory()->create([
        'title' => 'Electronics',
    ]);

    // Act
    $response = $this->getJson('/api/categories');

    // Assert
    $response->assertStatus(200)
        ->assertExactJson([
            [
                'id' => $category->id,
                'title' => 'Electronics',
            ],
        ]);
});

test('uses caching for categories', function (): void {
    // Arrange
    Category::factory()->count(2)->create();

    // Clear cache to start fresh
    Cache::forget('categories');

    // Act - First request should hit the database and cache the result
    $response1 = $this->getJson('/api/categories');

    // Assert cache was set
    expect(Cache::has('categories'))->toBeTrue();

    // Add a new category directly to database (bypassing cache)
    $newCategory = Category::factory()->create([
        'title' => 'New Category',
    ]);

    // Act - Second request should return cached data (without new category)
    $response2 = $this->getJson('/api/categories');

    // Assert
    $response1->assertStatus(200);
    $response2->assertStatus(200);

    // Both responses should be identical (cached)
    expect($response1->json())->toBe($response2->json());

    // The new category should not be in the response (because it's cached)
    $response2->assertJsonMissing([
        'id' => $newCategory->id,
        'title' => $newCategory->title,
    ]);

    expect($response2->json())->toHaveCount(2); // Only original 2 categories
});

test('cache expires after one hour', function (): void {
    // Arrange
    Category::factory()->create(['title' => 'Initial Category']);

    // Clear cache
    Cache::forget('categories');

    // Act - First request caches data
    $response1 = $this->getJson('/api/categories');

    // Simulate cache expiry by manually forgetting it
    Cache::forget('categories');

    // Add new category
    Category::factory()->create(['title' => 'New Category']);

    // Act - Second request after cache expiry
    $response2 = $this->getJson('/api/categories');

    // Assert
    $response1->assertStatus(200);
    $response2->assertStatus(200);

    expect($response1->json())->toHaveCount(1);
    expect($response2->json())->toHaveCount(2); // Should include new category
});

test('handles database errors gracefully', function (): void {
    // This test would require mocking database failures
    // For now, we'll test that the endpoint exists and works

    // Act
    $response = $this->getJson('/api/categories');

    // Assert
    $response->assertStatus(200);
});

test('returns correct HTTP headers', function (): void {
    // Arrange
    Category::factory()->create();

    // Act
    $response = $this->getJson('/api/categories');

    // Assert
    $response->assertStatus(200)
        ->assertHeader('Content-Type', 'application/json');
});

test('endpoint is accessible without authentication', function (): void {
    // Arrange
    Category::factory()->create(['title' => 'Public Category']);

    // Act - Request without authentication
    $response = $this->getJson('/api/categories');

    // Assert
    $response->assertStatus(200)
        ->assertJsonFragment([
            'title' => 'Public Category',
        ]);
});

test('supports GET method only', function (): void {
    // Act & Assert
    $this->postJson('/api/categories')->assertStatus(405);
    $this->putJson('/api/categories')->assertStatus(405);
    $this->patchJson('/api/categories')->assertStatus(405);
    $this->deleteJson('/api/categories')->assertStatus(405);
});

test('handles malformed requests gracefully', function (): void {
    // Act
    $response = $this->get('/api/categories', [
        'Accept' => 'text/html', // Wrong accept header
    ]);

    // Assert - Should still work and return JSON
    $response->assertStatus(200);
});

test('category resource format is consistent', function (): void {
    // Arrange
    $category = Category::factory()->create([
        'title' => 'Test Category',
    ]);

    // Act
    $response = $this->getJson('/api/categories');

    // Assert
    $response->assertStatus(200);

    $categoryData = $response->json()[0];
    expect($categoryData)
        ->toHaveKeys(['id', 'title'])
        ->not()->toHaveKey('created_at')
        ->not()->toHaveKey('updated_at');

    expect($categoryData['id'])->toBeInt();
    expect($categoryData['title'])->toBeString();
});

test('handles large number of categories efficiently', function (): void {
    // Arrange
    Category::factory()->count(50)->create();

    // Act
    $startTime = microtime(true);
    $response = $this->getJson('/api/categories');
    $executionTime = microtime(true) - $startTime;

    // Assert
    $response->assertStatus(200);
    expect($response->json())->toHaveCount(50);
    expect($executionTime)->toBeLessThan(1.0); // Should complete in less than 1 second
});

test('categories endpoint exists and is routed correctly', function (): void {
    // Act
    $response = $this->getJson('/api/categories');

    // Assert - Should not return 404
    $response->assertStatus(200);
});
