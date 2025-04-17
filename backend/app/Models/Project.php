<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ActivityLog;


class Project extends Model
{
	use HasFactory;

	protected $fillable = [
		'name', 'description'
	];

	public function tasks() {
		return $this->hasMany(Task::class);
		//PHP entende que está no mesmo Namespace
	}

	protected static function booted()
	{
		static::created(function ($project) {
			ActivityLog::create([
				'action' => 'created',
				'model' => 'Project',
				'model_id' => $project->id,
				'description' => 'Project created'
			]);
		});
	}
}

