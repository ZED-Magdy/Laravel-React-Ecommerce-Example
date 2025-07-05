<?php

declare(strict_types=1);

namespace App\Actions\Catalog\Products;

use Illuminate\Support\Facades\DB;

final class GetMinMaxProductsPriceAction
{
    /**
     * @return array{min_price: int, max_price: int}
     */
    public function execute(): array
    {
        /**
         * @var object{min_price: int|null, max_price: int|null} $prices
         */
        $prices = DB::table('products')
            ->select(DB::raw('MIN(price) as min_price'), DB::raw('MAX(price) as max_price'))
            ->first();

        return [
            'min_price' => $prices->min_price ? ((int) $prices->min_price) / 100 : 0,
            'max_price' => $prices->max_price ? ((int) $prices->max_price) / 100 : 0,
        ];
    }
}
