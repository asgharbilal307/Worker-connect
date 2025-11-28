<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosts extends Model
{
    use HasFactory;
    //
    protected $table = 'job_posts'; // ✅ Make sure this matches your actual DB table name
    //protected $fillable = ['name'];
}
