<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\Catalog\Categories\GetCategoriesAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

final class CategoryController extends Controller
{
    /**
     * @return AnonymousResourceCollection<CategoryResource>
     */
    public function index(GetCategoriesAction $getCategoriesAction): AnonymousResourceCollection
    {
        $categories = Cache::remember('categories', now()->addHour(),
            fn (): Collection => $getCategoriesAction->execute()
        );

        return CategoryResource::collection($categories);
    }
}
