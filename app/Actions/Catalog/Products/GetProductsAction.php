<?php

declare(strict_types=1);

namespace App\Actions\Catalog\Products;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

final class GetProductsAction
{
    /**
     * @param array{category_id: int, price_min: int, price_max: int, search: string, page: int} $filters
     * @return LengthAwarePaginator<Product>
     */
    public function execute(array $filters): LengthAwarePaginator
    {
        return Product::query()
            ->when($filters['category_id'], function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($filters['price_min'], function ($query, $priceMin) {
                $query->where('price', '>=', $priceMin);
            })
            ->when($filters['price_max'], function ($query, $priceMax) {
                $query->where('price', '<=', $priceMax);
            })
            ->when($filters['search'], function ($query, $search) {
                $query->where('title', 'like', '%' . $search . '%');
            })
            ->with(['category' => function ($query) {
                $query->select('id', 'title');
            }])
            ->orderBy('price', 'asc')
            ->paginate(6, ['*'], 'page', $filters['page'] ?? 1);
    }
}