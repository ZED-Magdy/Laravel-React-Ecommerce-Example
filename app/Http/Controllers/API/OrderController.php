<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\Orders\CalculateCartAction;
use App\Actions\Orders\CheckoutAction;
use App\Actions\Orders\GetNextOrderNumberAction;
use App\Actions\Orders\GetOrderDetailsAction;
use App\Actions\Orders\GetOrdersListAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Orders\CalculateCartRequest;
use App\Http\Requests\Orders\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

final class OrderController extends Controller
{
    /**
     * Checkout the order.
     */
    public function checkout(CheckoutRequest $checkoutRequest, CheckoutAction $checkoutAction): JsonResponse
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            /** @var array{user_id: int, items: array<array{product_id: int, quantity: int}>} $data */
            $data = [...$checkoutRequest->validated(), 'user_id' => $user->id];
            $order = $checkoutAction->execute($data);

            return response()->json($order, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Get the order details.
     */
    public function getOrderDetails(Request $request, string $orderId): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $order = Cache::remember(
            'order_'.$orderId.'_'.$user->id,
            now()->addHour(),
            fn (): Order => (new GetOrderDetailsAction())->execute((int) $orderId, (int) $user->id)
        );

        return response()->json($order, Response::HTTP_OK);
    }

    /**
     * Get the orders list.
     */
    public function getOrdersList(Request $request, GetOrdersListAction $getOrdersListAction): AnonymousResourceCollection
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $orders = Cache::remember(
            'orders_'.$user->id,
            now()->addHour(),
            fn (): LengthAwarePaginator => $getOrdersListAction->execute((int) $user->id)
        );

        return OrderResource::collection($orders);
    }

    /**
     * Get the next order number.
     */
    public function getNextOrderNumber(Request $request, GetNextOrderNumberAction $getNextOrderNumberAction): JsonResponse
    {
        $request->user();
        $orderNumber = Cache::remember(
            'next_order_number',
            now()->addHour(),
            fn (): int => $getNextOrderNumberAction->execute()
        );

        return response()->json([
            'order_number' => $orderNumber,
        ]);
    }

    /**
     * Calculate the cart.
     */
    public function calculateCart(CalculateCartRequest $request, CalculateCartAction $calculateCartAction): JsonResponse
    {
        try {
            $cart = $calculateCartAction->execute($request->validated());

            return response()->json($cart, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
