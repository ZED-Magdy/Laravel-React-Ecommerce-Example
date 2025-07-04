<?php

declare(strict_types=1);

namespace App\Actions\Catalog\Categories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

final class GetCategoriesAction
{
    /**
     * @return Collection<int, Category>
     */
    public function execute(): Collection
    {
        return Category::query()->orderBy('id', 'asc')->get(['id', 'title']);
    }
}
