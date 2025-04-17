<?php

namespace App\Notifications;


use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskNotification extends Notification
{
	use Queueable;
	// Trait
	
	protected $message;

	public function __construct($message) 
	{
		$this->message = $message;
	}

	public function via($notifiable)
	{
		return ['mail', 'database'];
	}

	public function toMail($notifiable)
	{
		return (new \Illuminate\Notifications\Messages\MailMessage)//FQCN / other 'use' 
			->line($this->message)
			->action('View Task', url('/'))
			->line('Thank you for using our application!');
	}
	
	public function toArray($notifiable)
	{
		return [
			'message' => $this->message
		];
	}
}
