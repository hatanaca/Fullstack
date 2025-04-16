<?php
// routes/api.php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PingController;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

