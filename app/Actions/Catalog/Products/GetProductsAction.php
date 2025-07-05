<?php

declare(strict_types=1);

namespace App\Actions\Catalog\Products;

use App\Models\Product;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Pagination\LengthAwarePaginator;

final class GetProductsAction
{
    /**
     * @param  array{categories: array<int, int>|null, price_min: int|null, price_max: int|null, search: string|null, page: int|null}  $filters
     * @return LengthAwarePaginator<int, Product>
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        return Product::query()
            ->when($filters['categories'] ?? null, function ($query, array $categories): void {
                $validCategories = array_filter($categories,
                    fn ($category): bool => $category !== 0 && $category > 0);
                /**
                 * @var array<int, int> $validCategories
                 */
                if ($validCategories !== []) {
                    $query->whereIn('category_id', $validCategories);
                }
            })
            ->when($filters['price_min'] ?? null, function ($query, int $priceMin): void {
                if ($priceMin > 0) {
                    $query->where('price', '>=', $priceMin * 100);
                }
            })
            ->when($filters['price_max'] ?? null, function ($query, int $priceMax): void {
                if ($priceMax > 0) {
                    $query->where('price', '<=', $priceMax * 100);
                }
            })
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                if (mb_strlen($search) > 0) {
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
