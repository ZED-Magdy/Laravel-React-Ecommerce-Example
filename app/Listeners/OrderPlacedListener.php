<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderPlacedNotification;

class OrderPlacedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $order = Order::find($event->orderId);
        if(!$order) {
            return;
        }

        // Find the admin
        // In a real application, we would use the admin user from the database by role for example
        $user = User::query()->first();
        if(!$user) {
            return;
        }

        // Send email to admin
        $user->notify(new OrderPlacedNotification($order, $user));

    }
}
