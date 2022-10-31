<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Validator;

class CatalogController extends Controller
{
    function products(Request $request) {
        $validator = Validator::make($request->all(),[
            'page' => 'required|integer|min:1',
            'page_size' => 'required|integer|min:1',
            'category_ids' => 'required|array',
            'brand_ids' => 'required|array',
            'size_ids' => 'required|array',
            'material_ids' => 'required|array',
            'color_ids' => 'required|array',
            'price_min' => 'required|integer',
            'price_max' => 'required|integer',
            'sort_new' => 'required|boolean',
            'sort_price' => 'required|boolean',
            'ids' => 'array'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        if(array_key_exists('ids',$data)) {
            $products = Product::whereIn('id',$data['ids']);
        }
        else {
            $products = Product::query();
        }
        if($data['sort_new']) {
            $products = $products->orderBy('new','desc');
        }
        $products = $products
        ->whereIn('category_id',$data['category_ids'])
        ->where('price_discount','>',$data['price_min'])
        ->where('price_discount','<',$data['price_max'])
        ->whereIn('brand_id',$data['brand_ids'])
        ->whereIn('size_id',$data['size_ids'])
        ->whereIn('color_id',$data['color_ids'])
        ->whereIn('material_id',$data['material_ids'])
        ->orderBy('price_discount',$data['sort_price']?'asc':'desc')
        ->leftjoin('categories','products.category_id','=','categories.id')
        ->select('products.*','category.name')
        ->paginate($data['page_size']);
        if($products->count()===0) return response()->json([],404);
        return response()->json($products);
    }
}
