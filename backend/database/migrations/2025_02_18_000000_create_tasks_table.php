<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
	public function up()
	{
		Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description')->nullable();
        $table->boolean('completed')->default(false);

        // Adicione esta coluna para relacionamento com projetos
        $table->foreignId('project_id')
              ->nullable()
              ->constrained('projects')
              ->onDelete('set null');

        $table->timestamps();
	    });
    }
	public function down()
	{
		Schema::dropIfExists('tasks');
	}
}

