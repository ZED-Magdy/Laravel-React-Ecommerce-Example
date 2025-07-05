<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Order
 */
final class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'subtotal' => $this->subtotal,
            'shipping' => $this->shipping,
            'tax' => $this->tax,
            'total' => $this->total,
            'items' => $this->whenLoaded('items', fn () => OrderItemResource::collection($this->items)),
        ];
    }
}
