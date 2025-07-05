<?php

declare(strict_types=1);

use App\Actions\Orders\CheckoutAction;
use App\Actions\Orders\GetNextOrderNumberAction;
use App\Actions\Orders\GetOrderDetailsAction;
use App\Actions\Orders\GetOrdersListAction;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;


beforeEach(function () {
    $this->user = User::factory()->create();
    $this->products = Product::factory()->count(3)->create(['price' => 1000]);
});

test('checkout action creates order and items', function () {
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    $items = $this->products->map(fn ($p) => ['product_id' => $p->id, 'quantity' => 2])->toArray();
    $order = $action->execute(['user_id' => $this->user->id, 'items' => $items]);
    expect($order)->toBeInstanceOf(Order::class);
    expect($order->items)->toHaveCount(3);
    expect($order->subtotal)->toBe(1000 * 2 * 3);
    expect($order->order_number)->toBe(1);
});

test('checkout action generates sequential order numbers', function () {
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    $items = $this->products->map(fn ($p) => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    
    $order1 = $action->execute(['user_id' => $this->user->id, 'items' => $items]);
    $order2 = $action->execute(['user_id' => $this->user->id, 'items' => $items]);
    
    expect($order1->order_number)->toBe(1);
    expect($order2->order_number)->toBe(2);
});

test('checkout action preserves product details', function () {
    $product = $this->products->first();
    $product->title = 'Test Product';
    $product->save();
    
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    $items = [['product_id' => $product->id, 'quantity' => 1]];
    $order = $action->execute(['user_id' => $this->user->id, 'items' => $items]);
    
    $orderItem = $order->items->first();
    expect($orderItem->title)->toBe('Test Product');
    expect($orderItem->price)->toBe($product->price);
    expect($orderItem->total)->toBe($product->price);
});

test('checkout action throws on empty items', function () {
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    expect(fn () => $action->execute(['user_id' => $this->user->id, 'items' => []]))->toThrow(Exception::class);
});

test('checkout action throws on invalid product', function () {
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    $items = [['product_id' => 999999, 'quantity' => 1]];
    expect(fn () => $action->execute(['user_id' => $this->user->id, 'items' => $items]))->toThrow(Exception::class);
});

test('checkout action throws on zero quantity', function () {
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    $items = [['product_id' => $this->products->first()->id, 'quantity' => 0]];
    expect(fn () => $action->execute(['user_id' => $this->user->id, 'items' => $items]))
    ->toThrow(Exception::class);
});

test('checkout action throws on negative quantity', function () {
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    $items = [['product_id' => $this->products->first()->id, 'quantity' => -1]];
    expect(fn () => $action->execute(['user_id' => $this->user->id, 'items' => $items]))->toThrow(Exception::class);
});

test('checkout action calculates tax and total', function () {
    config(['order.shipping_in_cents' => 500, 'order.tax_rate' => 10]);
    $action = new CheckoutAction(new GetNextOrderNumberAction());
    $items = $this->products->map(fn ($p) => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    $order = $action->execute(['user_id' => $this->user->id, 'items' => $items]);
    $subtotal = 1000 * 3;
    $tax = $subtotal * 0.10;
    $shipping = 500;
    $total = $subtotal + $tax + $shipping;
    expect($order->subtotal)->toBe((int) floor($subtotal));
    expect($order->tax)->toBe((int) floor($tax));
    expect($order->shipping)->toBe((int) floor($shipping));
    expect($order->total)->toBe((int) floor($total));
});

test('get order details action returns correct order', function () {
    $checkout = new CheckoutAction(new GetNextOrderNumberAction());
    $items = $this->products->map(fn ($p) => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    $order = $checkout->execute(['user_id' => $this->user->id, 'items' => $items]);
    $action = new GetOrderDetailsAction();
    $found = $action->execute($order->id, $this->user->id);
    expect($found->id)->toBe($order->id);
    expect($found->items)->toHaveCount(3);
});

test('get order details action throws for wrong user', function () {
    $checkout = new CheckoutAction(new GetNextOrderNumberAction());
    $items = $this->products->map(fn ($p) => ['product_id' => $p->id, 'quantity' => 1])->toArray();
    $order = $checkout->execute(['user_id' => $this->user->id, 'items' => $items]);
    $action = new GetOrderDetailsAction();
    $otherUser = User::factory()->create();
    expect(fn () => $action->execute($order->id, $otherUser->id))->toThrow(Exception::class);
});

test('get order details action throws for non-existent order', function () {
    $action = new GetOrderDetailsAction();
    expect(fn () => $action->execute(99999, $this->user->id))->toThrow(Exception::class);
});

test('get orders list action paginates orders', function () {
    $checkout = new CheckoutAction(new GetNextOrderNumberAction());
    foreach (range(1, 15) as $i) {
        $items = $this->products->map(fn ($p) => ['product_id' => $p->id, 'quantity' => 1])->toArray();
        $checkout->execute(['user_id' => $this->user->id, 'items' => $items]);
    }
    $action = new GetOrdersListAction();
    $paginator = $action->execute($this->user->id);
    expect($paginator->total())->toBe(15);
    expect($paginator->perPage())->toBe(10);
    expect($paginator->count())->toBe(10);
    expect($paginator->lastPage())->toBe(2);
});

test('get orders list action returns empty paginator for no orders', function () {
    $action = new GetOrdersListAction();
    $paginator = $action->execute($this->user->id);
    expect($paginator->total())->toBe(0);
    expect($paginator->count())->toBe(0);
    expect($paginator->items())->toBeEmpty();
});
