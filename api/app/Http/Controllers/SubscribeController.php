<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Product;
use App\Models\Size;
use App\Models\Subscribe;


class SubscribeController extends Controller
{
    function get(Request $request) {
        $subscribesOld = $request->user->subscribes()
        ->select('subscribes.*', 'products.id as product_id', 'products.name as product_name', 'sizes.name as size','colors.name as color')
        ->leftJoin('products','subscribes.product_id','products.id')
        ->leftJoin('sizes','subscribes.size_id','sizes.id')
        ->leftJoin('colors','products.color_id','colors.id')
        ->where('subscribes.new', false)->get()->toArray();
        $subscribes = $request->user->subscribes()
        ->select('subscribes.*', 'products.id as product_id', 'products.name as product_name', 'sizes.name as size','colors.name as color')
        ->leftJoin('products','subscribes.product_id','products.id')
        ->leftJoin('sizes','subscribes.size_id','sizes.id')
        ->leftJoin('colors','products.color_id','colors.id')
        ->where('subscribes.new', true)->get();
        foreach($subscribes as $subscribe) {
            $product = Product::find($subscribe->product_id);
            $sizeName = $subscribe->size;
            if($product->$sizeName > 0) {
                array_push($subscribesOld, $subscribe->toArray());
                // $subscribe->new = false;
                $subscribe->delete();
            }
        }
        return response()->json($subscribesOld);
    }

    function count(Request $request) {
        $subscribes = $request->user->subscribes()
        ->where('new', true)
        ->get();
        $count = 0;
        foreach($subscribes as $subscribe) {
            $sizeName = $subscribe->size->name;
            if($subscribe->product->$sizeName > 0) {
                $count ++;
            }
        }
        return response()->json([
            'notifications_count' => $count
        ]);
    }

    function getIds(Request $request) {
        $subscribes = $request->user->subscribes()
        ->orderBy('product_id','asc')
        ->get();
        $ids = [];
        foreach($subscribes as $subscribe) {
            if(!isset($ids[$subscribe->product_id])) {
                $ids[$subscribe->product_id] = [];
            }
            $ids[$subscribe->product_id][$subscribe->size->name] = true;
        }
        return response()->json($ids);
    }

    function create(Request $request) {
        $validator = Validator::make($request->all(),[
            'product_id' => 'required|integer',
            'size' => 'required|string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $user = $request->user;
        $size = Size::firstWhere('name', $data['size']);
        if($size===null) return response()->json([
            'message' => 'invalid size'
        ],400);
        $sizeName = $size->name;
        $product = Product::query()
        // ->where('id', $data['product_id'])
        // ->where(function($query) use($sizeName){
        //     $query->where($sizeName, '<', 0)
        //     ->orWhere($sizeName, null);
        // })
        ->where($sizeName, '<', 0)
        ->where('id', $data['product_id'])
        ->first();
        if($product===null) return response()->json([
            'message' => 'no product with count < 0'
        ],400);
        $existingSubscribe = $user->subscribes()
        ->where('new', true)
        ->where('product_id',$product->id)
        ->where('size_id', $size->id)
        ->first();
        if($existingSubscribe !== null) {
            return response()->json([
                'message' => 'allready subscribed'
            ],400);
        }
        $subscribe = new Subscribe;
        $subscribe->user_id = $user->id;
        $subscribe->product_id = $product->id;
        $subscribe->size_id = $size->id;
        $subscribe->new = true;
        $subscribe->save();
        return response()->json([
            'message' => 'subscribe created'
        ]);
    }
}
