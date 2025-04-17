<?php 

namespace Tests\Feature;
//this file is used with php unit ou artisan
use illuminate\Foundation\Testing\RefreshDatabase;
//in that context use is importing the class
use Tests\TestCase;
use app\Models\Task;

class TaskTest extends TestCase
{
	use RefreshDatabase;
	//in this context 'use' is taking properties and methods from RefreshDatabase
	//without herance
	public function test_create_task()
	{
		//[title: 'Test Task'] 
		$data = [
			'title' => 'Test Task',
			'desciption' => 'Test description',
			'completed' => false
		];
		//u can declare variable in any part, this reffers to his class instance
		$response = $this->postJson('/api/tasks', $data);
		$response->assertStatus(201)->assertJsonFragment(['title' => 'Test Task']);
		$this->assertDatabaseHas('tasks', ['title' => 'Test Task']);
	}

	public function test_fetch_tasks_with_filtering()
	{
		Task::factory()->create(['title' => 'Unique Task']);
		//:: acess static method, that return a instance and after call a method from that instance(Objeto)
		$response = $this->getJson('/api/tasks?search=Unique');
		$response->assertStatus(200)->assertJsonFragment(['title' => 'Unique Task']);
	}
}

