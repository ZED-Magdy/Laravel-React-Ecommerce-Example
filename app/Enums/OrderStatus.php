<?php

declare(strict_types=1);

namespace App\Enums;

enum OrderStatus: int
{
    case PENDING = 0;
    case PROCESSING = 1;
    case SHIPPED = 2;
    case COMPLETED = 3;
    case CANCELLED = 4;

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::PROCESSING => 'Processing',
            self::SHIPPED => 'Shipped',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'bg-yellow-500',
            self::PROCESSING => 'bg-blue-500',
            self::SHIPPED => 'bg-green-500',
            self::COMPLETED => 'bg-green-500',
            self::CANCELLED => 'bg-red-500',
        };
    }
}
