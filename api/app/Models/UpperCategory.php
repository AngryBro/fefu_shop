<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UpperCategory extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at'];

    function categoriesToShow() {
        return $this->hasMany(Category::class)->where('show',true);
    }
    function categories() {
        return $this->hasMany(Category::class);
    }
}
