<?php

/**
 * Customer Model
 * Represents a customer entity in the system
 */
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class Customer extends Authenticatable implements JWTSubject
{
    // Customer model for users hiring workers
    use HasFactory;
    protected $fillable = [
        'name', 'email', 'password', 'city', 'gender', 'phone', 'role', 'cnic',
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

}
