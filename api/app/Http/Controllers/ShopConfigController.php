<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShopConfig;
use Validator;
use App\Rules\ContactId;

class ShopConfigController extends Controller
{
    private function closure($e) {
            return [
                'id' => $e->id,
                'name' => $e->name,
                'value' => json_decode($e->value,true)
            ];
    }

    function get(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $name = $validator->validated()['name'];
        if(!in_array($name, ['pickup_point','pickup_payment','delivery_payment', 'slide'])) {
            return response()->json([
                'message' => 'no access'
            ],403);
        }
        $config = ShopConfig::query()
        ->where('name', $name)
        ->first();
        $configValue = json_decode($config->value,true);
        return response()->json($configValue);
    }

    function getAll() {
        return response()->json(ShopConfig::all()->map(function($e){return $this->closure($e);}));
    }

    function update(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'value' => 'array'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $config = ShopConfig::firstWhere('name', $data['name']);
        if($config === null) {
            return response()->json([
                'message' => 'no config'
            ], 400);
        }
        if(isset($data['value'])) {
            $config->value = $data['value'];
            $config->save();
        }
        return response()->json([
            'message' => 'config updated'
        ]);
    }
}
