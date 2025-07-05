<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subtotal',
        'shipping',
        'tax',
        'total',
        'order_number',
        'status',
    ];

    /**
     * Get the user that owns the order.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items of the order.
     *
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the subtotal of the order.
     *
     * @return Attribute<int, int>
     */
    public function subtotal(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): int|float => is_numeric($value) ? (int) $value / 100 : 0,
            set: fn (mixed $value): int => is_numeric($value) ? (int) $value * 100 : 0,
        );
    }

    /**
     * Get the shipping of the order.
     *
     * @return Attribute<int, int>
     */
    public function shipping(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): int|float => is_numeric($value) ? (int) $value / 100 : 0,
            set: fn (mixed $value): int => is_numeric($value) ? (int) $value * 100 : 0,
        );
    }

    /**
     * Get the tax of the order.
     *
     * @return Attribute<int, int>
     */
    public function tax(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): int|float => is_numeric($value) ? (int) $value / 100 : 0,
            set: fn (mixed $value): int => is_numeric($value) ? (int) $value * 100 : 0,
        );
    }

    /**
     * Get the total of the order.
     *
     * @return Attribute<int, int>
     */
    public function total(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): int|float => is_numeric($value) ? (int) $value / 100 : 0,
            set: fn (mixed $value): int => is_numeric($value) ? (int) $value * 100 : 0,
        );
    }

    /**
     * Get the casts of the order.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
        ];
    }
}
