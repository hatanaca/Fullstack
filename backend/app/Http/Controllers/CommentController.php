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
            // Log the request
            Log::info('Fetching comments for task', ['task_id' => $taskId]);

            // Verify task exists
            $taskExists = \App\Models\Task::where('id', $taskId)->exists();
            if (!$taskExists) {
                Log::warning('Task not found', ['task_id' => $taskId]);
                return response()->json([
                    'error' => 'Task not found',
                    'task_id' => $taskId
                ], 404);
            }

            $comments = Comment::where('task_id', $taskId)
                ->with('user:id,name') // Carrega apenas id e nome
                ->latest() // Mais recentes primeiro
                ->get();

            // Log para debug
            Log::info('Comments fetched', [
                'count' => $comments->count(),
                'task_id' => $taskId,
                'sample' => $comments->take(2)
            ]);

            return response()->json($comments);
        } catch (\Exception $e) {
            Log::error('Error fetching comments', [
                'task_id' => $taskId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to fetch comments',
                'message' => $e->getMessage(),
                'task_id' => $taskId
            ], 500);
        }
    }

    // POST /api/tasks/{taskId}/comments
    public function store(Request $request, $taskId)
    {
        try {
            // Log the incoming request for debugging
            Log::info('Comment request received', [
                'task_id' => $taskId,
                'request_data' => $request->all(),
                'headers' => $request->headers->all()
            ]);

            // Verify task exists first
            $taskExists = \App\Models\Task::where('id', $taskId)->exists();
            if (!$taskExists) {
                Log::warning('Attempted to add comment to non-existent task', ['task_id' => $taskId]);
                return response()->json([
                    'error' => 'Task not found',
                    'task_id' => $taskId
                ], 404);
            }

            // Validate with more details on errors
            try {
                $validated = $request->validate([
                    'content' => 'required|string',
                ]);
            } catch (\Illuminate\Validation\ValidationException $e) {
                Log::warning('Comment validation failed', [
                    'errors' => $e->errors(),
                    'request' => $request->all()
                ]);

                return response()->json([
                    'error' => 'Validation failed',
                    'details' => $e->errors()
                ], 422);
            }

            // Add the task ID
            $validated['user_id'] = auth()->id(); // ✅ ID seguro
            $validated['task_id'] = $taskId;

            // Attempt to create the comment
            $comment = Comment::create($validated);

            // Explicitly load the user relation
            $comment->load('user:id,name');

            // Log success
            Log::info('Comment created successfully', [
                'comment_id' => $comment->id,
                'task_id' => $taskId,
                'user_id' => $validated['user_id'],
                'comment_data' => $comment->toArray()
            ]);

            // Return the comment with HTTP 201 Created status
            return response()->json($comment, 201);

        } catch (\Exception $e) {
            // Log detailed error information
            Log::error('Error creating comment', [
                'exception_class' => get_class($e),
                'task_id' => $taskId,
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            // Return informative error response
            return response()->json([
                'error' => 'Failed to create comment',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'type' => get_class($e)
            ], 500);
        }
    }
}
