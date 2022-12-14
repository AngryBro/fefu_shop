<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;
use Validator;
use App\Models\Product;

class MaterialController extends Controller
{
    function get() {
        return response()->json(Material::orderBy('id','desc')->get());
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
        $material = Material::find($data['id']);
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
        $material = Material::firstWhere('name', $name);
        if($material !== null) {
            return response()->json([
                'message' => 'allready exists'
            ], 422);
        }
        $material = new Material;
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
        $material = Material::find($id);
        if($material !== null) {
            $product = Product::firstWhere('material_id', $id);
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
