<?php

declare(strict_types=1);

namespace App\Actions\Catalog\Products;

use App\Models\Product;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Pagination\LengthAwarePaginator;

final class GetProductsAction
{
    /**
     * @param  array{categories: array|null, category_id: int|null, price_min: int|null, price_max: int|null, search: string|null, page: int|null}  $filters
     * @return LengthAwarePaginator<int, Product>
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        return Product::query()
            ->when($filters['categories'] ?? null, function ($query, array $categories): void {
                // Filter out empty values and ensure we have valid categories
                $validCategories = array_filter($categories, function ($category) {
                    return !empty($category) && is_numeric($category) && $category > 0;
                });
                
                if (count($validCategories) > 0) {
                    $query->whereIn('category_id', $validCategories);
                }
            })
            ->when($filters['price_min'] ?? null, function ($query, int $priceMin): void {
                if ($priceMin > 0) {
                    $query->whereMinPrice($priceMin);
                }
            })
            ->when($filters['price_max'] ?? null, function ($query, int $priceMax): void {
                if ($priceMax > 0) {
                    $query->whereMaxPrice($priceMax);
                }
            })
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                if (strlen($search) > 0) {
                    $query->where('title', 'like', '%'.$search.'%');
                }
            })
            ->with(['category' => function (Relation $relation): void {
                $relation->select('id', 'title');
            }])
            ->orderBy('price', 'asc')
            ->paginate(6, ['*'], 'page', $filters['page'] ?? 1);
    }
}
