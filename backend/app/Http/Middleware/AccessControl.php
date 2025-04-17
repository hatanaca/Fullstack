<?php 

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccessControl
{

	public function handle(Request $request, Closure $next, $role = 'admin')
	{
		$user = Auth::user();
		if (!$user || $user->role !== $role) {
			return response()->json(['message' => 'Unauthorized'], 403);
		}
		return $next($request);
	}
}

