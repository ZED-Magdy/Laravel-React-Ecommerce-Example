<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route
Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Laravel!'
    ]);
}); 