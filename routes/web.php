<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// API routes are handled in routes/api.php

// All other routes should fall back to the React app
Route::get('/{path?}', fn () => view('welcome'))->where('path', '.*');
