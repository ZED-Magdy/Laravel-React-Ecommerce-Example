<?php

declare(strict_types=1);

namespace App\Actions\Catalog\Products;

use App\Models\Product;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Pagination\LengthAwarePaginator;

final class GetProductsAction
{
    /**
     * @param  array{category_id: int|null, price_min: int|null, price_max: int|null, search: string|null, page: int|null}  $filters
     * @return LengthAwarePaginator<int, Product>
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        return Product::query()
            ->when($filters['category_id'] ?? null, function ($query, int $categoryId): void {
                $query->where('category_id', $categoryId);
            })
            ->when($filters['price_min'] ?? null, function ($query, int $priceMin): void {
                $query->whereMinPrice($priceMin);
            })
            ->when($filters['price_max'] ?? null, function ($query, int $priceMax): void {
                $query->whereMaxPrice($priceMax);
            })
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where('title', 'like', '%'.$search.'%');
            })
            ->with(['category' => function (Relation $relation): void {
                $relation->select('id', 'title');
            }])
            ->orderBy('price', 'asc')
            ->paginate(6, ['*'], 'page', $filters['page'] ?? 1);
    }
}
