<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

final class Product extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'price',
        'category_id',
        'stock',
    ];

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('thumbnail')
            ->fit(Fit::Contain, 385, 385);
    }

    /**
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
     * @param  Builder<Product>  $builder
     * @return Builder<Product>
     *
     * @phpstan-ignore-next-line
     */
    #[\Illuminate\Database\Eloquent\Attributes\Scope]
    private function whereMinPrice(Builder $builder, int $priceMin): Builder
    {
        return $builder->where('price', '>=', $priceMin * 100);
    }

    /**
     * @param  Builder<Product>  $builder
     * @return Builder<Product>
     *
     * @phpstan-ignore-next-line
     */
    #[\Illuminate\Database\Eloquent\Attributes\Scope]
    private function whereMaxPrice(Builder $builder, int $priceMax): Builder
    {
        return $builder->where('price', '<=', $priceMax * 100);
    }
}
