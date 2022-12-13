<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderPosition;
use App\Models\Order;
use Validator;
use App\Mail\OrderMail;
use App\Models\ShopConfig;
use Mail;

class OrderController extends Controller
{
    function all(Request $request) {
        $validator = Validator::make($request->all(), [
            'page' => 'required|integer|min:1',
            'page_size' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'no page or page_size'
        ],422);
        $data = $validator->validated();
        $orders = Order::query()
        ->select('orders.*','users.phone_number as phone_number')
        ->leftJoin('users','orders.user_id','users.id')
        ->orderBy('orders.created_at','desc')
        ->paginate($data['page_size']);
        if($orders->count()===0) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json($orders);
    }

    function get(Request $request) {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid id'
        ]);
        $id = $validator->validated()['id'];
        $order = Order::find($id);
        if($order === null) return response()->json([
            'message' => 'not found'
        ],404);
        $positions = $order->positions()
        ->leftJoin('products','products.id', 'order_positions.product_id')
        ->leftJoin('colors', 'colors.id', 'products.color_id')
        ->select('order_positions.*', 'products.name as name', 'products.article as article','colors.article as color_article')
        ->get();
        $user = $order->user;
        $order = $order->toArray();
        $order['positions'] = $positions;
        $order['user'] = $user;
        return response()->json($order);
    }

    function create(Request $request) {
        $validator = Validator::make($request->all(),[
            'delivery' => 'required|boolean',
            'name' => 'string|nullable',
            'email' => 'email|nullable',
            'comment' => 'string|nullable',
            'apartment' => 'string|nullable'
        ]);
        $validator->sometimes(['city', 'building', 'street'], 'required|string', function($input) {
            return $input->delivery;
        });
        $validator->sometimes(['index'], 'required|integer', function($input){
            return $input->delivery;
        });
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $user = $request->user;
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
            $size = $position->size;
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
                if(isset($data[$param])) {
                    $order->$param = $data[$param];  
                }  
            }
        }
        $order->price = 0;
        $order->price_discount = 0;
        $order->discount = 0;
        $order->save();
        foreach($positions as $position) {
            $product = $position->product;
            $size = $position->size;
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
            $orderPosition->size = $position->size;
            $orderPosition->save();
        }
        $order->save();
        $cart->user_id = null;
        $cart->save();
        // try {
        //     Mail::to(json_decode(ShopConfig::firstWhere('name', 'email')->value,false)[0])->send(new OrderMail($order));
        // }
        // catch(Exception $e) {
        //     return response()->json([
        //         'message' => 'mail failed, order created',
        //         'number' => $order->id
        //     ]);
        // }
        return response()->json([
            'message' => 'order created',
            'number' => $order->id
        ]);
    }
}
