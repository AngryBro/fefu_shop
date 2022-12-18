<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;
use Str;
use App\Models\Product;
use App\Models\Category;
use App\Models\Config;
use App\Models\InfoPage;

class ImageController extends Controller
{
    function get(Request $request) {
        $validator = Validator::make($request->all(),[
            'file' => 'string|required'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'no file name'
        ],422);
        $file = $validator->validated()['file'];
        $path = "public/$file";
        if(!Storage::exists($path)) {
            return response()->json([
                'message' => 'not found'
            ],404);
        }
        return response()->file(Storage::path($path));
    }

    function upload(Request $request) {
        $validator = Validator::make($request->all(),[
            'photo' => 'required|image',
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid file'
        ],422);
        $file = $validator->validated()['photo'];
        $tempname = Str::random(20);
        $file->storeAs('public', $tempname);
        return response()->json([
            'tempname' => $tempname
        ]);
    }

    function delete(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string',
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid name'
        ],422);
        $file = $validator->validated()['name'];

    }
}
