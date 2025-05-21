<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ActivityLog;
use Illuminate\Support\Str; // Added missing import

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'content'
    ];

    // Ensure proper loading of relationships
    protected $with = ['user'];

    // Relacionamento com Task
    public function task() {
        return $this->belongsTo(Task::class)->select(['id', 'title']);
    }

    // Relacionamento com User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)
            ->withDefault([ // Fallback se o usuário não existir
                'id' => 0,
                'name' => 'Usuário Deletado',
                'email' => 'n/a'
            ]);
    }

    // Custom toArray to ensure consistent format
    public function toArray()
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name
            ],
            'created_at' => $this->created_at ? $this->created_at->toDateTimeString() : null,
        ];
    }

    protected static function booted()
    {
        static::created(function ($comment) {
            ActivityLog::create([
                'action' => 'commented',
                'model' => 'Comment',
                'model_id' => $comment->id,
                'description' => 'New comment added: ' . Str::limit($comment->content, 20)
            ]);
        });
    }
}
