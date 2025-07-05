<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
final class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'title' => $this->faker->sentence,
            'image_url' => $this->faker->imageUrl,
            'quantity' => $this->faker->numberBetween(1, 10),
            'price' => $this->faker->numberBetween(1000, 10000),
            'total' => $this->faker->numberBetween(1000, 10000),
        ];
    }
}
