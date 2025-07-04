<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

test('can get authenticated user data', function () {
    // Arrange
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => Hash::make('password123'),
    ]);

    Sanctum::actingAs($user);

    // Act
    $response = $this->getJson('/api/user');

    // Assert
    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
});

test('returns 401 when not authenticated', function () {
    // Act
    $response = $this->getJson('/api/user');

    // Assert
    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Unauthenticated.'
        ]);
});

test('returns 401 with invalid token', function () {
    // Act
    $response = $this->withHeaders([
        'Authorization' => 'Bearer invalid-token'
    ])->getJson('/api/user');

    // Assert
    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Unauthenticated.'
        ]);
});

test('user endpoint requires authentication middleware', function () {
    // Arrange
    $user = User::factory()->create();

    // Act - Request without authentication
    $response = $this->getJson('/api/user');

    // Assert
    $response->assertStatus(401);
});

test('user endpoint returns correct user data structure', function () {
    // Arrange
    $user = User::factory()->create([
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
    ]);

    Sanctum::actingAs($user);

    // Act
    $response = $this->getJson('/api/user');

    // Assert
    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
            ]
        ])
        ->assertJsonMissing([
            'password',
            'created_at',
            'updated_at',
        ]);
});

test('user endpoint works with valid sanctum token', function () {
    // Arrange
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $token = $user->createToken('test-token')->plainTextToken;

    // Act
    $response = $this->withHeaders([
        'Authorization' => "Bearer $token"
    ])->getJson('/api/user');

    // Assert
    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
}); 