<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catelog\ProductFilterRequest;
use App\Actions\Catalog\Products\GetProductsAction;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * @param ProductFilterRequest $request
     * @return AnonymousResourceCollection<ProductResource>
     */
    public function index(ProductFilterRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $cacheKey = 'products_' . md5(json_encode($filters));

        $products = Cache::remember($cacheKey, now()->addHour(), function () use ($filters) {
            return (new GetProductsAction())->execute($filters);
        });

        return ProductResource::collection($products);
    }
}
