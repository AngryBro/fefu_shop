<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Str;

class BearerToken extends Model
{
    use HasFactory;
    function user() {
        return $this->belongsTo(User::class);
    }
    static function generate() {
        return Str::random(64);
    }
}
