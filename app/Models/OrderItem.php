<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class OrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'title',
        'image_url',
        'quantity',
        'price',
        'total',
    ];

    /**
     * Get the order that owns the order item.
     *
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product that owns the order item.
     *
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the price of the order item.
     *
     * @return Attribute<int, int>
     */
    public function price(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value): int|float => is_numeric($value) ? (int) $value / 100 : 0,
            set: fn (mixed $value): int => is_numeric($value) ? (int) $value * 100 : 0,
        );
    }

    /**
     * Get the total of the order item.
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
}
