<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class OrderPlacedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Order $order, public User $user) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('A new order has been placed.')
            ->line('Order Number: '.$this->order->order_number)
            ->line('Total: '.$this->order->total)
            ->line('Created At: '.$this->order->created_at)
            ->action('View Order', url('/order/'.$this->order->id))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'user_id' => $this->user->id,
            'order_number' => $this->order->order_number,
            'total' => $this->order->total,
            'status' => $this->order->status,
            'created_at' => $this->order->created_at,
            'updated_at' => $this->order->updated_at,
        ];
    }
}
