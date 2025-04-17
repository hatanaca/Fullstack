<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ActivityLog;

class Comment extends Model 
{
	use HasFactory;

	protected $fillable = [
		'task_id',
		'user_id',
		'content'
	];

	public function task() {
		return $this->belongsTo(Task::class);
	}

	public function user() {
		return $this->belongsTo(User::class);
	}

	protected static function booted()
	{
		static::created(function ($comment) {
			ActivityLog::create([
				'action' => 'commented',
				'model' => 'Comment',
				'model_id' => $comment->id,
				'description' => 'New comment added'
			]);
		});
	}
}
