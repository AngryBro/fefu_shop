<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $hidden = ['role_id'];

    function role() {
        return $this->belongsTo(Role::class);
    }
    function favourite() {
        return $this->hasOne(Favourite::class);
    }
    function cart() {
        return $this->hasOne(Cart::class);
    }
    function subscribes() {
        return $this->hasMany(Subscribe::class);
    }
}
