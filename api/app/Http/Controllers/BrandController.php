<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Brand;
use Validator;

class BrandController extends Controller
{
    function get() {
        return response()->json(Brand::orderBy('id','desc')->get());
    }

    function update(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'name' => 'required|string|min:3'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ], 422);
        $data = $validator->validated();
        $material = Brand::find($data['id']);
        if($material !== null) {
            $material->name = $data['name'];
            $material->save();
        }
        return response()->json([
            'message' => 'material updated'
        ]);
    }

    function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ], 422);
        $name = $validator->validated()['name'];
        $material = Brand::firstWhere('name', $name);
        if($material !== null) {
            return response()->json([
                'message' => 'allready exists'
            ], 422);
        }
        $material = new Brand;
        $material->name = $name;
        $material->save();
        return response()->json([
            'message' => 'created'
        ]);
    }

    function delete(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ], 422);
        $id = $validator->validated()['id'];
        $material = Brand::find($id);
        if($material !== null) {
            $product = Product::firstWhere('brand_id', $id);
            if($product === null) {
                $material->delete();
                return response()->json([
                    'message' => 'deleted'
                ]);
            }
        }
        return response()->json([
            'message' => 'not deleted'
        ], 400);
    }
}
