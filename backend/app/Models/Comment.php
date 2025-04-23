<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
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

    // Relacionamento com Task (Opcional: carregar apenas campos essenciais)
    public function task() {
        return $this->belongsTo(Task::class)->select(['id', 'title']);
    }

    // Relacionamento com User (Garantir campos mínimos)
    public function user(): BelongsTo
{
    return $this->belongsTo(User::class)
        ->withDefault([ // Fallback se o usuário não existir
            'name' => 'Usuário Deletado',
            'email' => 'n/a'
        ])
        ->select(['id', 'name']); // Carrega apenas campos essenciais
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
