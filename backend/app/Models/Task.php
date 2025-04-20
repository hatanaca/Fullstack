<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ActivityLog;

class Task extends Model
{
	use HasFactory;

	protected $fillable = [
		'title',
		'description',
		'completed',
		'project_id',
	];

	public function comments() {
		return $this->hasMany(Comment::class);
	}

	public function attachments() {
		return $this->hasMany(Attachment::class);
	}

	protected static function booted()
    {
        static::deleting(function ($task) {
        // Deleta todos os comentários e attachments relacionados
        $task->comments()->delete();
        $task->attachments()->delete();
        });

		static::created(function ($task) {
			ActivityLog::create([
				'action' => 'created',
				'model' => 'Task',
				'model_id' => $task->id,
				'description' => 'Task created'
			]);
		});
		static::updated(function ($task) {
			ActivityLog::create([
				'action' => 'updated',
				'model' => 'Task',
				'model_id' => $task->id,
				'description' => 'Task updated'
			]);
		});
		static::deleted(function ($task) {
			ActivityLog::create([
				'action' => 'deleted',
				'model' => 'Task',
				'model_id' => $task->id,
				'description' => 'Task deleted'
			]);
		});
	}
}
