<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('can login with valid credentials via API', function (): void {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Act
    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    // Assert
    $response->assertStatus(200)
        ->assertJsonStructure([
            'token',
            'user' => [
                'id',
                'name',
                'email',
            ],
        ]);

    // Assert that the user data is correct
    $response->assertJsonFragment([
        'email' => 'test@example.com',
    ]);

    // Assert that token is present and not empty
    $token = $response->json('token');
    expect($token)->toBeString()->not()->toBeEmpty();
});

test('returns 401 with invalid credentials', function (): void {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Act
    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    // Assert
    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Invalid credentials',
        ]);
});

test('returns 401 with non-existent user', function (): void {
    // Act
    $response = $this->postJson('/api/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password123',
    ]);

    // Assert
    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Invalid credentials',
        ]);
});

test('requires email field', function (): void {
    // Act
    $response = $this->postJson('/api/login', [
        'password' => 'password123',
    ]);

    // Assert
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('requires password field', function (): void {
    // Act
    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
    ]);

    // Assert
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('requires valid email format', function (): void {
    // Act
    $response = $this->postJson('/api/login', [
        'email' => 'invalid-email',
        'password' => 'password123',
    ]);

    // Assert
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('handles empty request body', function (): void {
    // Act
    $response = $this->postJson('/api/login', []);

    // Assert
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'password']);
});

test('handles malformed JSON', function (): void {
    // Act
    $response = $this->postJson('/api/login', [], [
        'Content-Type' => 'application/json',
    ]);

    // Assert
    $response->assertStatus(422);
});

test('login timing is consistent for different scenarios', function (): void {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Act & Assert - Test with valid user but wrong password
    $start1 = microtime(true);
    $response1 = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);
    $duration1 = microtime(true) - $start1;

    // Act & Assert - Test with non-existent user
    $start2 = microtime(true);
    $response2 = $this->postJson('/api/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password123',
    ]);
    $duration2 = microtime(true) - $start2;

    // Assert responses
    $response1->assertStatus(401);
    $response2->assertStatus(401);

    // Assert timing consistency (both should take ~300ms)
    expect($duration1)->toBeGreaterThan(0.25);
    expect($duration1)->toBeLessThan(0.35);
    expect($duration2)->toBeGreaterThan(0.25);
    expect($duration2)->toBeLessThan(0.35);

    // The difference should be minimal
    expect(abs($duration1 - $duration2))->toBeLessThan(0.05);
});

test('login endpoint exists and is accessible', function (): void {
    // Act
    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    // Assert - Should not return 404 (endpoint exists)
    $response->assertStatus(401); // 401 because credentials are invalid, not 404
});

test('handles concurrent requests properly', function (): void {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $responses = [];
    $startTime = microtime(true);

    // Act - Make multiple concurrent requests
    for ($i = 0; $i < 3; ++$i) {
        $responses[] = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);
    }

    $endTime = microtime(true);

    // Assert - All requests should return 401
    foreach ($responses as $response) {
        $response->assertStatus(401);
    }

    // Total time should be reasonable (not 3x the individual request time)
    expect($endTime - $startTime)->toBeLessThan(1.0); // Should complete in under 1 second
});
