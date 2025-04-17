<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
	//GET  /api/projects
	public function index()
	{
		$projects = Project::all();
		return response()->json($projects);
	}

	//POST /api/projects
	public function store(Request $request)
	{//  class -> var => injeção de dependencia, auto no Larav != PHP
		$validated = $request->validate([
			'name' => 'required|max:255',
			'description' => 'nullable'
		]);

		try {
			$project = Project::create($validated);
			return response()->json($project, 201);
		} catch (\Exception $e) {
			return response()->json(['message' => 'Error creating project'],500);
		}
	}
}

