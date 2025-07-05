<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Models\Order;

final class GetOrderDetailsAction
{
    public function execute(int $orderId, int $userId): Order
    {
        return Order::query()
            ->where('id', $orderId)
            ->where('user_id', $userId)
            ->with('items')
            ->firstOrFail();
    }
}
