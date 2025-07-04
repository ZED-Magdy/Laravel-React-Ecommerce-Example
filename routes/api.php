<?php

declare(strict_types=1);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());

// Test route
Route::get('/hello', fn () => response()->json([
    'message' => 'Hello from Laravel!',
]));
