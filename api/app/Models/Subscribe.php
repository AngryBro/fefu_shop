<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscribe extends Model
{
    use HasFactory;
    protected $hidden = ['size_id', 'user_id','created_at', 'updated_at'];

    function product() {
        return $this->belongsTo(Product::class);
    }
    function size() {
        return $this->belongsTo(Size::class);
    }
}
