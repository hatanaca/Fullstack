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
            $comments = Comment::where('task_id', $taskId)
                ->with('user:id,name') // Carrega apenas id e nome
                ->latest() // Mais recentes primeiro
                ->get();

            // Log para debug
            Log::info('Comments fetched', ['count' => $comments->count(), 'task_id' => $taskId]);

            return response()->json($comments);
        } catch (\Exception $e) {
            Log::error('Error fetching comments', [
                'task_id' => $taskId,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Failed to fetch comments'], 500);
        }
    }

    // POST /api/tasks/{taskId}/comments
    public function store(Request $request, $taskId)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string',
                'user_id' => 'required|exists:users,id'
            ]);

            $validated['task_id'] = $taskId;

            $comment = Comment::create($validated);

            // Garantir que o usuário seja carregado
            $comment->load('user:id,name');

            // Log para debug
            Log::info('Comment created', [
                'comment_id' => $comment->id,
                'task_id' => $taskId,
                'user_id' => $validated['user_id']
            ]);

            // Retorna o comentário completo com o objeto user incluído
            return response()->json($comment, 201);
        } catch (\Exception $e) {
            Log::error('Error creating comment', [
                'task_id' => $taskId,
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json(['error' => 'Failed to create comment'], 500);
        }
    }
}
