<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPosition extends Model
{
    use HasFactory;
    function order() {
        return $this->belongsTo(Order::class);
    }
    function product() {
        return $this->belongsTo(Product::class);
    }
    function size() {
        return $this->belongsTo(Size::class);
    }
}
