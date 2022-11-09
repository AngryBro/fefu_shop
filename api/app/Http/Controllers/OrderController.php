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
            'delivery' => 'required|boolean'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $user = $request->user;
        $cart = $user->cart;
        $positions = $cart->positions;
        $order = new Order;
        $order->user_id = $user->id;
        $order->delivery = $data['delivery'];
        foreach($positions as $position) {
            $product = $position->product;
            $orderPosition = new OrderPosition;
            $orderPosition->product_id = $product->id;
            $orderPosition->count = $position->count;
            $orderPosition->price = $product->price_discount;
        }
    }
}
