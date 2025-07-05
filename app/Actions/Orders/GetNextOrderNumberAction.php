<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Models\Order;

final class GetNextOrderNumberAction
{
    public function execute(int $userId): int
    {
        return Order::query()
            ->where('user_id', $userId)
            ->max('order_number') + 1;
    }
}