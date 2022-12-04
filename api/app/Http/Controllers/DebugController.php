<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\BearerToken;
use App\Mail\TestMail;
use Illuminate\Support\Facades\Mail;
use App\Helpers\ImageUrl;

class DebugController extends Controller
{
    function debug(Request $request) {
        return response()->json([
            
        ]);
    }
}
