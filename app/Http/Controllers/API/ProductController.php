<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\Catalog\Products\GetProductsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catelog\ProductFilterRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

final class ProductController extends Controller
{
    /**
     * @return AnonymousResourceCollection<ProductResource>
     */
    public function index(ProductFilterRequest $productFilterRequest): AnonymousResourceCollection
    {
        /**
         * @var array{category_id: int|null, price_min: int|null, price_max: int|null, search: string|null, page: int|null} $filters
         */
        $filters = $productFilterRequest->validated();
        $cacheKey = 'products_'.md5((string) json_encode($filters));

        $products = Cache::remember($cacheKey, now()->addHour(), fn (): \Illuminate\Pagination\LengthAwarePaginator => (new GetProductsAction())->execute($filters));

        return ProductResource::collection($products);
    }
}
