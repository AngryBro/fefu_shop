<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Color;
use Validator;

class ColorController extends Controller
{
    function all(Request $request) {
        $colors = Color::all();
        if(count($colors) === 0) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json($colors);
    }

    function create(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|min:2',
            'rgb' => 'required|string',
            'article' => 'required|string|max:4'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $color = Color::query()
        ->where(function($query) use($data){
            $query->where('name', $data['name'])
            ->orWhere('article',$data['article']);
        })->first();
        if($color !== null) return response()->json([
            'message' => 'this color exists'
        ], 400);
        $color = new Color;
        foreach($data as $key => $value) {
            $color->$key = $value;
        }
        $color->save();
        return response()->json([
            'message' => 'color created'
        ]);
    }

    function update(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer',
            'name' => 'string',
            'article' => 'string|max:4',
            'rgb' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $color = Color::find($data['id']);
        if($color === null) return response()->json([
            'message' => 'no color with this id'
        ],400);
        unset($data['id']);
        foreach($data as $key => $value) {
            $color->$key = $value;
        }
        $color->save();
        return response()->json([
            'message' => 'color updated'
        ]);
    }

    function delete(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $id = $validator->validated()['id'];
        $color = Color::find($id);
        if($color === null) return response()->json([
            'message' => 'no color with this id'
        ],400);
        $color->delete();
        return response()->json([
            'message' => 'color deleted'
        ]);
    }
}
