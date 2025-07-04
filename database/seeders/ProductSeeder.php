<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

final class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product1 = Product::create([
            'title' => 'Black Striped T-shirt',
            'price' => 120,
            'category_id' => 1,
            'stock' => 30,
        ]);

        $product1->addMediaFromUrl('https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format')
            ->toMediaCollection('thumbnail');

        $product2 = Product::create([
            'title' => 'Polo with Tipping Details',
            'price' => 180,
            'category_id' => 2,
            'stock' => 18,
        ]);

        $product2->addMediaFromUrl('https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop&auto=format')
            ->toMediaCollection('thumbnail');

        $product3 = Product::create([
            'title' => 'Classic Blue Jeans',
            'price' => 200,
            'category_id' => 3,
            'stock' => 15,
        ]);

        $product3->addMediaFromUrl('https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format')
            ->toMediaCollection('thumbnail');

        $product4 = Product::create([
            'title' => 'Plaid Flannel Shirt',
            'price' => 250,
            'category_id' => 4,
            'stock' => 22,
        ]);

        $product4->addMediaFromUrl('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&auto=format')
            ->toMediaCollection('thumbnail');

        $product5 = Product::create([
            'title' => 'Black Cotton T-shirt',
            'price' => 110,
            'category_id' => 1,
            'stock' => 20,
        ]);

        $product5->addMediaFromUrl('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&auto=format')
            ->toMediaCollection('thumbnail');

        $product6 = Product::create([
            'title' => 'White Cotton T-shirt',
            'price' => 145,
            'category_id' => 1,
            'stock' => 20,
        ]);

        $product6->addMediaFromUrl('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format')
            ->toMediaCollection('thumbnail');
    }
}
