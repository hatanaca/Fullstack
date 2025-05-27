<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    // GET /api/tasks/{taskId}/comments
    public function index($taskId)
    {
        try {
            // Verify task exists
            $taskExists = \App\Models\Task::where('id', $taskId)->exists();
            if (!$taskExists) {
                return response()->json([
                    'error' => 'Task not found',
                    'task_id' => $taskId
                ], 404);
            }

            $comments = Comment::where('task_id', $taskId)
                ->with('user:id,name')
                ->latest()
                ->get();

            return response()->json($comments);
        } catch (\Exception $e) {
            Log::error('Error fetching comments', [
                'task_id' => $taskId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to fetch comments',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // POST /api/tasks/{taskId}/comments
    public function store(Request $request, $taskId)
    {
        try {
            // A autenticação já é verificada pelo middleware auth:sanctum
            $user = $request->user();

            // Verify task exists
            $taskExists = \App\Models\Task::where('id', $taskId)->exists();
            if (!$taskExists) {
                return response()->json([
                    'error' => 'Task not found',
                    'task_id' => $taskId
                ], 404);
            }

            // Validate request
            $validated = $request->validate([
                'content' => 'required|string',
            ]);

            // Create comment with authenticated user
            $comment = Comment::create([
                'content' => $validated['content'],
                'task_id' => $taskId,
                'user_id' => $user->id, // Usuário autenticado pelo Sanctum
            ]);

            // Load user relation
            $comment->load('user:id,name');

            Log::info('Comment created successfully', [
                'comment_id' => $comment->id,
                'task_id' => $taskId,
                'user_id' => $user->id,
            ]);

            return response()->json($comment, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating comment', [
                'task_id' => $taskId,
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to create comment',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
