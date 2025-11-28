<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skills_Category extends Model
{
    protected $table = 'skills_category_'; // ✅ Make sure this matches your actual DB table name
    protected $fillable = ['name'];

   public function skills()
   {
       return $this->hasMany(Worker::class);
   }

}
