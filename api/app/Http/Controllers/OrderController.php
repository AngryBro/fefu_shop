<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderPosition;
use App\Models\Order;
use Validator;

class OrderController extends Controller
{
    function create(Request $request) {
        $validator = Validator::make($request->all(),[
            'delivery' => 'required|boolean',
            'name' => 'string',
            'email' => 'email',
            'comment' => 'string'
        ]);
        $validator->sometimes(['city', 'building', 'apartment', 'street'], 'required|string', function($input) {
            return $input->delivery;
        });
        $validator->sometimes('index', 'required|integer', function($input){
            return $input->delivery;
        });
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $user = $request->user;
        if(($user->name === null) && (!isset($data['name'])) ||
            ($user->email === null)&&(!isset($data['email']))) {
                return response()->json([
                    'message' => 'name or email required'
                ],422);
        }
        $cart = $user->cart;
        if($cart === null) return response()->json([
            'message' => 'no cart'
        ],400);
        $positions = $cart->positions;
        if(count($positions)===0) {
            return response()->json([
                'message' => 'empty cart'
            ],400);
        }
        $expiredProducts = [];
        foreach($positions as $position) {
            $product = $position->product;
            $size = $position->size->name;
            if($product->$size < $position->count) {
                $expiredProduct = [
                    'position_id' => $position->id,
                    'product_name' => $product->name,
                    'product_size' => $size,
                    'product_color' => $product->color->name,
                    'product_count_max' => $product->$size
                ];
                array_push($expiredProducts, $expiredProduct);
            }
        }
        if(count($expiredProducts)>0) {
            return response()->json($expiredProducts,400);
        }
        if($user->name === null) {
            $user->name = $data['name'];
        }
        if($user->email === null) {
            $user->email = $data['email'];
        }
        $user->save();
        $order = new Order;
        $order->user_id = $user->id;
        $order->delivery = $data['delivery'];
        if(isset($data['comment'])) {
            $order->comment = $data['comment'];
        }
        if($data['delivery']) {
            foreach(['city', 'street', 'building', 'apartment','index'] as $param) {
                $order->$param = $data[$param];    
            }
        }
        $order->price = 0;
        $order->price_discount = 0;
        $order->discount = 0;
        $order->save();
        foreach($positions as $position) {
            $product = $position->product;
            $size = $position->size->name;
            $order->price += $product->price * $position->count;
            $order->discount += $product->discount * $position->count;
            $order->price_discount += $product->price_discount * $position->count;
            $product->$size -= $position->count;
            if($product->$size === 0) {
                $product->$size --;
            }
            $product->save();
            $orderPosition = new OrderPosition;
            $orderPosition->order_id = $order->id;
            $orderPosition->product_id = $product->id;
            $orderPosition->count = $position->count;
            $orderPosition->price = $product->price;
            $orderPosition->price_discount = $product->price_discount;
            $orderPosition->discount = $product->discount;
            $orderPosition->size_id = $position->size_id;
            $orderPosition->save();
        }
        $order->save();
        $cart->user_id = null;
        $cart->save();
        return response()->json([
            'message' => 'order created'
        ]);
    }
}
