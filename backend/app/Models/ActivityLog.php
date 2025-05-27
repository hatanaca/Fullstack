<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Models;

class ActivityLog extends Model
{
	use HasFactory;

	protected $fillable = [
		'action',
		'model',
		'model_id',
		'description'
	];
}
