<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\BearerToken;

class DebugController extends Controller
{
    function debug(Request $request) {
        $user = User::find(1);
        return response()->json([
            'token' => BearerToken::generate()
        ]);
    }
}
