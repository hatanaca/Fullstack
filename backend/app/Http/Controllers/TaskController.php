<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Notifications\TaskNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
	// GET /api/tasks/my
	public function index(Request $request)
	{
		try {
			$query = Task::where('user_id', Auth::id());

			if ($request->has('completed')) {
				$query->where('completed', $request->query('completed'));
			}

			if ($request->has('search')) {
				$search = $request->query('search');
				$query->where(function($q) use ($search) {
					$q->where('title', 'ILIKE', "%$search%")
					  ->orWhere('description', 'ILIKE', "%$search%");
				});
			}

			$tasks = $query->get();
			return response()->json($tasks);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Erro ao buscar tarefas'], 500);
		}
	}

	// POST /api/tasks
	public function store(Request $request)
	{
		$validated = $request->validate([
			'title' => 'required|max:255',
			'description' => 'nullable',
			'completed' => 'boolean',
			'project_id' => 'nullable|exists:projects,id'
		]);

		try {
			$validated['user_id'] = Auth::id();
			$task = Task::create($validated);

			// Notificar apenas o usuário que criou a tarefa
			Auth::user()->notify(new TaskNotification("Nova tarefa '{$task->title}' criada."));

			return response()->json($task, 201);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Erro ao criar tarefa'], 500);
		}
	}

	public function show($id)
	{
		try {
			$task = Task::with(['comments', 'attachments'])
				->where('user_id', Auth::id())
				->findOrFail($id);
			return response()->json($task);
		} catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
			return response()->json(['message' => 'Tarefa não encontrada'], 404);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Erro ao buscar tarefa'], 500);
		}
	}

	// PUT /api/tasks/{id}
	public function update(Request $request, $id)
	{
		try {
			$task = Task::where('user_id', Auth::id())->findOrFail($id);

			$validated = $request->validate([
				'title' => 'sometimes|required|max:255',
				'description' => 'nullable',
				'completed' => 'boolean',
				'project_id' => 'nullable|exists:projects,id'
			]);

			$task->update($validated);
			return response()->json($task);
		} catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
			return response()->json(['message' => 'Tarefa não encontrada'], 404);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Erro ao atualizar tarefa'], 500);
		}
	}

	/**
	 * Toggle the completion status of a task
	 */
	public function toggleCompletion($id)
	{
		try {
			$task = Task::where('user_id', Auth::id())->findOrFail($id);
			$task->completed = !$task->completed;
			$task->save();

			$status = $task->completed ? 'concluída' : 'reaberta';
			Auth::user()->notify(new TaskNotification("Tarefa '{$task->title}' foi {$status}."));

			return response()->json($task);
		} catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
			return response()->json(['message' => 'Tarefa não encontrada'], 404);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Erro ao alterar status da tarefa'], 500);
		}
	}

	//DELETE /api/tasks/{id}
	public function destroy($id)
	{
		if (!is_numeric($id)) {
			return response()->json(['message' => 'ID inválido'], 400);
		}

		try {
			$task = Task::where('user_id', Auth::id())->findOrFail($id);
			$task->delete();
			return response()->json(['message' => 'Tarefa excluída com sucesso']);
		} catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
			return response()->json(['message' => 'Tarefa não encontrada'], 404);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Erro ao excluir tarefa'], 500);
		}
	}
}







