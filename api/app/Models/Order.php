<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $hidden = ['updated_at', 'user_id'];
    function cart() {
        return $this->belongsTo(Cart::class);
    }
    function user() {
        return $this->belongsTo(User::class);
    }
    function positions() {
        return $this->hasMany(OrderPosition::class);
    }
}
