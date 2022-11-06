<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favourite;

class FavouriteController extends Controller
{
    function get(Request $request) {
        //
    }

    function addProduct(Request $request) {
        $validator = Validator::make($request->all(),[
            //
        ]);
        $favourite = Favourite::firstWhere('user_id',$request->user->id);
    }
}
