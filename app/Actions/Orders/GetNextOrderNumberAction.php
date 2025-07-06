<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Models\Order;

final class GetNextOrderNumberAction
{
    public function execute(): int
    {
        /**
         * @var int $orderNumber
         */
        $orderNumber = Order::query()->max('order_number');
        
        return (int) mb_str_pad((string) ($orderNumber + 1), 3, '0', STR_PAD_RIGHT);
    }
}
