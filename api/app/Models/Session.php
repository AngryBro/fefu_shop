<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Str;

class Session extends Model
{
    use HasFactory;
    function cart() {
        return $this->hasOne(Cart::class);
    }
    static function generateToken() {
        return Str::random(64);
    }
}
