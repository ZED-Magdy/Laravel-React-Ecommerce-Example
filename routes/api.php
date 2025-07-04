<?php

declare(strict_types=1);

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')
    ->get('/user', fn (Request $request): UserResource => new UserResource($request->user()))
    ->name('user.show');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
