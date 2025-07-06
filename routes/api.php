<?php

declare(strict_types=1);

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ProductController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->get('/user', fn (Request $request): UserResource => new UserResource($request->user()))
    ->name('user.show');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::get('/products/min-max-price', [ProductController::class, 'getMinMaxProductsPrice'])->name('products.min-max-price');
Route::post('/calculate-cart', [OrderController::class, 'calculateCart'])->name('orders.calculate-cart');


Route::group(['middleware' => 'auth:sanctum'], function (): void {

    Route::post('/checkout', [OrderController::class, 'checkout'])->name('checkout');

    Route::get('/orders/{orderId}', [OrderController::class, 'getOrderDetails'])->name('orders.show');

    Route::get('/orders', [OrderController::class, 'getOrdersList'])->name('orders.index');

    Route::get('/next-order-number', [OrderController::class, 'getNextOrderNumber'])->name('orders.next-order-number');

});



