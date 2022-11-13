<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $hidden = ['created_at', 'updated_at'];

    function products() {
        return $this->hasMany(Product::class);
    }

    function parentsAll() {
        return $this->belongsToMany(Category::class, 'categories_relations', 'child_id', 'parent_id');
    }

    function childrenAll() {
        return $this->belongsToMany(Category::class, 'categories_relations', 'parent_id', 'child_id');
    }
    function parents() {
        return $this->belongsToMany(Category::class, 'categories_relations', 'child_id', 'parent_id')->where('show', true);
    }

    function children() {
        return $this->belongsToMany(Category::class, 'categories_relations', 'parent_id', 'child_id')->where('show', true);
    }
}
