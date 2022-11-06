<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DebugController extends Controller
{
    function debug() {
        $a = [1,3,4,5,6];
        $a = new Collection($a);
        return response()->json([$a->paginate(2)]);
    }
}
