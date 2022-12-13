<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPosition extends Model
{
    protected $hidden = ['created_at', 'updated_at'];

    use HasFactory;
    function order() {
        return $this->belongsTo(Order::class);
    }
    function product() {
        return $this->belongsTo(Product::class);
    }
}
