<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class PingController extends Controller
{
    public function handle(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'pong'
        ]);
    }
}
