<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartProduct extends Model
{
    use HasFactory;
    protected $table = 'cart_product';
    protected $hidden = ['created_at', 'updated_at', 'brand_id', 'material_id', 'color_id', 'description', 'category_id'];

    function cart() {
        return $this->belongsTo(Cart::class);
    }
}
