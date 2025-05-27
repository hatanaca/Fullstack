<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Criar token para API
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Usuário registrado com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // POST /api/login
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($validated)) {
                return response()->json([
                    'message' => 'Credenciais inválidas'
                ], 401);
            }

            $user = Auth::user();

            // Deletar tokens antigos
            $user->tokens()->delete();

            // Criar novo token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Login realizado com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        try {
            // Deletar o token atual
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout realizado com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao fazer logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // GET /api/me
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Usuário não autenticado',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    // POST /api/refresh-token
    public function refreshToken(Request $request)
    {
        try {
            $user = $request->user();

            // Deletar token atual
            $user->currentAccessToken()->delete();

            // Criar novo token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Token renovado com sucesso',
                'token' => $token
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao renovar token',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
