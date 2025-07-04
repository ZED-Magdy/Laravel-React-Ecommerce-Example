<?php

namespace App\Http\Controllers\API;

use App\Actions\Auth\LoginAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * @param LoginRequest|Request $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request)
    {
        try {
            $loginAction = new LoginAction();
            $result = $loginAction->execute(
                email: $request->str('email')->value(),
                password: $request->str('password')->value(),
            );

            return response()->json([
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
}
