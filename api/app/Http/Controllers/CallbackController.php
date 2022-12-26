<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Callback;

class CallbackController extends Controller
{
    function create(Request $request) {
        $validator = Validator::make($request->all(),[
            'phone_number' => 'string',
            'name' => 'required|string',
            'message' => 'required|string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $callback = new Callback;
        foreach($data as $key => $value) {
            $callback->$key = $value;
        }
        $callback->save();
        return response()->json([
            'message' => 'callback sent'
        ]);
    }

    function get(Request $request) {
        $validator = Validator::make($request->all(),[
            'page' => 'required|integer|min:1',
            'page_size' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        return response()->json(Callback::orderBy('id', 'desc')->paginate($data['page_size']));
    }
}
