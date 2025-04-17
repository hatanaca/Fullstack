<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{	//GET /api/users protected by acess middleware
	public function index()
	{
		$users = User::all();
		return response()->json($users);
	}


	//PUT /api/users;{id}
	public function update(Request $request, $id)
	{
		$user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User deleted successfully']);

		}
		$validated = $request->validate([
			'name' => 'sometimes|required',
			'email' => 'sometimes|required|email',
			'role' => 'sometimes|required|in:admin,user'
		]);
		try {
			$user->update($validated);
			return response()->json($user);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Error updating user'], 500);
		}
	}


	//DELETE / api/users/{id}
	public function destroy($id)
	{
		$user = User::find($id);
		if (!$user) {
			return response()->json(['message' => 'User not found'], 404);
		}
		try {
			$user->delete();
			return response()->json(['message' => 'User not found'], 404);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Error deleting user'], 500);
		}
	}
}

