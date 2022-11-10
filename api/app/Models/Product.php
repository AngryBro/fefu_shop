<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $hidden = ['updated_at','created_at','color_id', 'material_id', 'brand_id', 'category_id'];

    function category() {
        return $this->belongsTo(Category::class);
    }
    function color() {
        return $this->belongsTo(Color::class);
    }
}
