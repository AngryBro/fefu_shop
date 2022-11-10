<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favourite;
use Validator;
use App\Models\FavouriteProduct;
use App\Models\Product;

class FavouriteController extends Controller
{
    function get(Request $request) {
        $userId = $request->user->id;
        $favourite = Favourite::firstWhere('user_id',$userId);
        if($favourite !== null) {
            $products = FavouriteProduct::query()
            ->select('products.*')
            ->leftJoin('products','favourite_product.product_id','products.id')
            ->where('favourite_product.favourite_id',$favourite->id)
            ->get();
        }
        else {
            $products = [];
        }
        if(count($products)===0) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json([
            'products' => $products
        ]);
    }

    function getIds(Request $request) {
        $userId = $request->user->id;
        $favourite = Favourite::firstWhere('user_id',$userId);
        if($favourite !== null) {
            $products = FavouriteProduct::query()
            ->select('product_id')
            ->where('favourite_id',$favourite->id)
            ->get();
        }
        else {
            $products = [];
        }
        $favouriteProducts = [];
        foreach($products as $product) {
            $favouriteProducts[$product->product_id] = true;
        }
        return response()->json(['product_ids' => $favouriteProducts]);
    }

    function deleteProduct(Request $request) {
        $validator = Validator::make($request->all(),[
            'product_id' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid id'
        ],422);
        $productId = $validator->validated()['product_id'];
        $userId = $request->user->id;
        $favourite = Favourite::firstWhere('user_id', $userId);
        if($favourite !== null) {
            $favouriteProduct = FavouriteProduct::query()
            ->where('favourite_id', $favourite->id)
            ->where('product_id', $productId)
            ->first();
        }
        else {
            $favouriteProduct = null;
        }
        if($favouriteProduct === null) return response()->json([
            'message' => 'this product is not in favourite'
        ],400);
        $favouriteProduct->delete();
        return response()->json([
            'message' => 'product deleted from favourite'
        ]);
    }

    function addProduct(Request $request) {
        $validator = Validator::make($request->all(),[
            'product_id' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid id'
        ],422);
        $productId = $validator->validated()['product_id'];
        $userId = $request->user->id;
        $favourite = Favourite::firstWhere('user_id', $userId);
        $product = Product::where('id', $productId)->where('show', true)->first();
        if($favourite !== null) {
            $favouriteProduct = FavouriteProduct::query()
            ->where('favourite_id',$favourite->id)
            ->where('product_id',$productId)
            ->first();
        }
        else {
            $favouriteProduct = null;
        }
        if(($product === null)||($favouriteProduct !== null)) {
            return response()->json([
                'message' => 'product is in favourites or not exists'
            ],400);
        }
        if($favourite === null) {
            $favourite = new Favourite;
            $favourite->user_id = $userId;
            $favourite->save();
        }
        $favouriteProduct = new FavouriteProduct;
        $favouriteProduct->product_id = $productId;
        $favouriteProduct->favourite_id = $favourite->id;
        $favouriteProduct->save();
        return response()->json([
            'message' => 'added to favourite'
        ]);
    }
}
