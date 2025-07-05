<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Models\Order;
use Illuminate\Pagination\LengthAwarePaginator;

final class GetOrdersListAction
{
    /**
     * Execute the action.
     *
     * @return LengthAwarePaginator<int, Order>
     */
    public function execute(int $userId): LengthAwarePaginator
    {
        return Order::query()
            ->where('user_id', $userId)
            ->latest()
            ->paginate(10);
    }
}
