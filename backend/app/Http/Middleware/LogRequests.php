<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
   public function handle($request, Closure $next) {
    \Log::info('Request:', [
        'method' => $request->method(),
        'url' => $request->fullUrl(),
        'params' => $request->all()
    ]);
    return $next($request);
}
}
