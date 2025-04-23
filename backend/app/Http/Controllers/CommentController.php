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


	// POST /api/tasks/{taskId}/comments
	public function store(Request $request, $taskId)
	{
		$validated = $request->validate([
			'content' => 'required|string',
			'user_id' => 'required|exists:users,id'
		]);
		$validated['task_id'] = $taskId;


		try {
                $comment = Comment::create($validated);
                $comment->load('user'); // Carregar relacionamento 'user' na resposta
                return response()->json($comment, 201);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Error creating comment'], 500);
            }
	}
}
