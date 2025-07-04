<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['title' => 'T-Shirts'],
            ['title' => 'Polo'],
            ['title' => 'Jeans'],
            ['title' => 'Shirts'],
        ];

        Category::insert($categories);
    }
}
