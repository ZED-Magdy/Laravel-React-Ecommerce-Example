<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
final class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'subtotal' => $this->faker->numberBetween(10000, 100000),
            'shipping' => $this->faker->numberBetween(1000, 10000),
            'tax' => $this->faker->numberBetween(1000, 10000),
            'total' => $this->faker->numberBetween(10000, 100000),
            'order_number' => $this->faker->unique()->numberBetween(100000, 999999),
            'status' => OrderStatus::PENDING->value,
        ];
    }
}
