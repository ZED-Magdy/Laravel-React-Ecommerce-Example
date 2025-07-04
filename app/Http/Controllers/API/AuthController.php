<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\Auth\LoginAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class AuthController extends Controller
{
    public function login(LoginRequest $loginRequest): JsonResponse
    {
        try {
            $loginAction = new LoginAction();
            $result = $loginAction->execute(
                email: $loginRequest->string('email')->value(),
                password: $loginRequest->string('password')->value(),
            );

            return response()->json([
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
            ], Response::HTTP_OK);
        } catch (Exception) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
}
