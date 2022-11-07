<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class DebugController extends Controller
{
    function debug(Request $request) {
        $user = User::find(1);
        return response()->json([
            'user' => $user->value('phone_number'),
            // 'session' => $request->xsession
        ]);
    }
}
