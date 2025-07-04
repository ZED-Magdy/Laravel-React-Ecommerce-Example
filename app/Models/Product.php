<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'price',
        'category_id',
        'stock',
    ];

    /** @return BelongsTo<Category, Product> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function registerMediaConversions(?Media $media = null): void
    {   
        $this
            ->addMediaConversion('thumbnail')
            ->fit(Fit::Contain, 385, 385)
            ->nonQueued();
    }

    public function price(): Attribute
    {
        return Attribute::make(
            get: fn (int $value) => $value / 100,
            set: fn (int $value) => $value * 100,
        );
    }
}
