<?php

declare(strict_types=1);

use App\Http\Controllers\API\AuthController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => new UserResource($request->user()));

Route::post('/login', [AuthController::class, 'login']);