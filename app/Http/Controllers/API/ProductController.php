<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\Catalog\Products\GetMinMaxProductsPriceAction;
use App\Actions\Catalog\Products\GetProductsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Catelog\ProductFilterRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
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
         * @var array{categories: array<int, int>|null, price_min: int|null, price_max: int|null, search: string|null, page: int|null} $filters
         */
        $filters = $productFilterRequest->validated();
        $cacheKey = 'products_'.md5((string) json_encode($filters));

        $lengthAwarePaginator = Cache::tags('products')->remember($cacheKey, now()->addHour(), fn (): \Illuminate\Pagination\LengthAwarePaginator => (new GetProductsAction())->execute($filters));

        return ProductResource::collection($lengthAwarePaginator);
    }

    public function getMinMaxProductsPrice(GetMinMaxProductsPriceAction $getMinMaxProductsPriceAction): JsonResponse
    {
        $minMaxPrices = Cache::remember(
            'min_max_products_price',
            now()->addHour(),
            /**
             * @return array{min_price: int, max_price: int}
             */
            fn (): array => $getMinMaxProductsPriceAction->execute()
        );

        return response()->json($minMaxPrices);
    }
}
