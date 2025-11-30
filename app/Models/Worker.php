<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class Worker extends Authenticatable implements JWTSubject
{
    // Worker model for skilled workers in the system
    use HasFactory;
    protected $fillable = [
        'name', 'email','password', 'city', 'gender', 'phone', 'role', 'cnic',
        'skills_id', 'experience', 'daily_charge', 'availability', 'bio',
    ];

    protected $hidden = [
        'password',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    public function getJWTCustomClaims()
    {
        return [];
    }
    public function skills()
    {
        return $this->belongsTo(Skills_Category::class);

    }

}
