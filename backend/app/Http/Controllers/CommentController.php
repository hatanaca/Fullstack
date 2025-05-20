<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;


class CommentController extends Controller
{

	// GET /api/tasks/{taskId}/comments
	public function index($taskId) {
    $comments = Comment::where('task_id', $taskId)
        ->with('user:id,name') // Carrega apenas id e nome
        ->get();
    return response()->json($comments);
}

    public function store(Request $request, $taskId)
{
    $validated = $request->validate([
        'content' => 'required|string',
        'user_id' => 'required|exists:users,id'
    ]);
    $validated['task_id'] = $taskId;

    $comment = Comment::create($validated);
    $comment->load('user:id,name'); // 👈 Carrega o relacionamento com o usuário

    // Retorna o comentário completo com o objeto user incluído
    return response()->json($comment, 201);
    }
}
