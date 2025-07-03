<?php

use Illuminate\Support\Facades\Route;

// API routes are handled in routes/api.php

// All other routes should fall back to the React app
Route::get('/{path?}', function () {
    return view('welcome');
})->where('path', '.*');
