<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Cart extends Model
{
    use HasFactory;
    
    function user() {
        return $this->belongsTo(User::class);
    }

    function positions() {
        return $this->hasMany(CartProduct::class);
    }

    function session() {
        return $this->belongsTo(Session::class);
    }
}
