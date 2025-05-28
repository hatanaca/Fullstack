<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PingController;

// Rotas públicas (sem autenticação)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/ping', [PingController::class, 'handle']);
Route::get('/login', function () {
    return response()->json(['message' => 'Login page']);
})->name('login');

// Rotas protegidas (com autenticação)
Route::middleware('auth:sanctum')->group(function () {

    // Rotas de autenticação
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

    // Rotas de projetos
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);

    // Rotas de tarefas
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::put('/tasks/{id}/toggle', [TaskController::class, 'toggleCompletion']);

    // Rotas de comentários
    Route::get('/tasks/{taskId}/comments', [CommentController::class, 'index']);
    Route::post('/tasks/{taskId}/comments', [CommentController::class, 'store']);

    // Rotas de anexos
    Route::post('/tasks/{taskId}/attachments', [AttachmentController::class, 'store']);

    // Rotas de usuários (admin)
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
