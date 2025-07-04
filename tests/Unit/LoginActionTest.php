<?php

declare(strict_types=1);

use App\Actions\Auth\LoginAction;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('can login with valid credentials', function () {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $loginAction = new LoginAction();

    // Act
    $result = $loginAction->execute('test@example.com', 'password123');

    // Assert
    expect($result)
        ->toBeArray()
        ->toHaveKeys(['token', 'user']);
    
    expect($result['user'])
        ->toBeInstanceOf(User::class)
        ->email->toBe('test@example.com');
    
    expect($result['token'])
        ->toBeString()
        ->not()->toBeEmpty();
});

test('throws exception with invalid email', function () {
    // Arrange
    $loginAction = new LoginAction();

    // Act & Assert
    expect(fn () => $loginAction->execute('nonexistent@example.com', 'password123'))
        ->toThrow(Exception::class, 'Invalid credentials');
});

test('throws exception with invalid password', function () {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('correctpassword'),
    ]);

    $loginAction = new LoginAction();

    // Act & Assert
    expect(fn () => $loginAction->execute('test@example.com', 'wrongpassword'))
        ->toThrow(Exception::class, 'Invalid credentials');
});

test('prevents timing attacks by having consistent execution time', function () {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $loginAction = new LoginAction();

    // Act - Test with valid user but wrong password
    $start1 = microtime(true);
    try {
        $loginAction->execute('test@example.com', 'wrongpassword');
    } catch (Exception $e) {
        // Expected
    }
    $duration1 = microtime(true) - $start1;

    // Act - Test with non-existent user
    $start2 = microtime(true);
    try {
        $loginAction->execute('nonexistent@example.com', 'password123');
    } catch (Exception $e) {
        // Expected
    }
    $duration2 = microtime(true) - $start2;

    // Assert - Both should take approximately the same time (300ms ± 50ms tolerance)
    expect($duration1)->toBeGreaterThan(0.25); // At least 250ms
    expect($duration1)->toBeLessThan(0.35);    // At most 350ms
    expect($duration2)->toBeGreaterThan(0.25); // At least 250ms
    expect($duration2)->toBeLessThan(0.35);    // At most 350ms
    
    // The difference should be minimal (within 50ms)
    expect(abs($duration1 - $duration2))->toBeLessThan(0.05);
});

test('executes within expected timeframe for valid credentials', function () {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $loginAction = new LoginAction();

    // Act
    $start = microtime(true);
    $result = $loginAction->execute('test@example.com', 'password123');
    $duration = microtime(true) - $start;

    // Assert - Should take approximately 300ms
    expect($duration)->toBeGreaterThan(0.25); // At least 250ms
    expect($duration)->toBeLessThan(0.35);    // At most 350ms
    expect($result)->toBeArray();
});

test('creates valid sanctum token', function () {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $loginAction = new LoginAction();

    // Act
    $result = $loginAction->execute('test@example.com', 'password123');

    // Assert - Check that token is valid
    expect($result['token'])->toBeString();
    
    // Verify the token can be used for authentication
    $tokens = $user->tokens()->where('name', 'auth_token')->get();
    expect($tokens)->toHaveCount(1);
}); 