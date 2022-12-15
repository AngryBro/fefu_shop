<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $hidden = ['updated_at','created_at'];

    function category() {
        return $this->belongsTo(Category::class);
    }
    function color() {
        return $this->belongsTo(Color::class);
    }
    function images() {
        return $this->hasMany(ProductImage::class);
    }
}
