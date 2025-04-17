<?php

use Illuminate\Database\Migrations\Migration;
use illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
//use -> namespace {{class,methods,etc}}
//migrations -> database version, change database, two functions  
//abstraction of database syntax
//--> :: <-- acess static properties, without instance, 
// static methods cant acess 'this'
class CreateActivityLogsTable extends Migration
{
	public function up()
	{	//1 - create table, 2 - aroow function that receive a objeto and creat coluns
		Schema::create('activity_logs', function (Blueprint $table) {
			$table->id();
			$table->string('action');
			$table->string('model');
			$table->unsignedBigInteger('model_id');
			$table->text('description')->nullable();
			$table->timestamps();
		});
	}
	public function down() 
	{
		Schema::dropIfExists('activity_logs');
	}// :: é usado para acessar o métodos e propriedades estaticas
}
	

