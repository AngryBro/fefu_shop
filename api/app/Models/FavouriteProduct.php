<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavouriteProduct extends Model
{
    protected $table = 'favourite_product';
    protected $hidden = ['created_at', 'updated_at', 'brand_id', 'material_id', 'color_id', 'description', 'category_id'];
    use HasFactory;
}
