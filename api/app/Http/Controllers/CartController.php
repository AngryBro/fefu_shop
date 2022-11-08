<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Product;
use App\Models\User;
use App\Models\Cart;
use App\Models\CartProduct;
use App\Models\Size;
use App\Models\Session;

class CartController extends Controller
{
    function addPosition(Request $request) {
        $validator = Validator::make($request->all(),[
            'product_id' => 'required|integer|min:1',
            'size_id' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid ids'
        ],422);
        $data = $validator->validated();
        $size = Size::find($data['size_id']);
        $product = Product::find($data['product_id']);
        if($size===null || $product===null) {
            return response()->json([
                'message' => 'no such product or size'
            ],400);
        }
        elseif(!($product->value($size->name)>0)) {
            return response()->json([
                'message' => 'product count is 0'
            ],400);
        }
        $position = CartProduct::query()
        ->where('product_id',$data['product_id'])
        ->where('size_id',$data['size_id'])
        ->first();
        if($position !== null) {
            return response()->json([
                'message' => 'this position is already in cart'
            ],400);
        }
        $newSession = false;
        if($request->user !== null) {
            $cart = $request->user->cart;
            if($cart === null) {
                $cart = new Cart;
                $cart->user_id = $request->user->id;
                $cart->save();
            }
        }
        elseif($request->xsession !== null) {
            $cart = $request->xsession->cart;
            if($cart === null) {
                $cart = new Cart;
                $cart->session_id = $request->xsession->id;
                $cart->save();
            }
        }
        else {
            $newSession = true;
            $cart = new Cart;
            $session = new Session;
            $session->token = Session::generateToken();
            $session->save();
            $cart->session_id = $session->id;
            $cart->save();
        }
        $position = new CartProduct;
        $position->cart_id = $cart->id;
        $position->count = 1;
        $position->size_id = $data['size_id'];
        $position->product_id = $data['product_id'];
        $position->save();
        return response()->json([
            'session' => $newSession?$session->token:null,
            'message' => 'position added'
        ]);
    }

    function deletePosition(Request $request) {
        $validator = $this->validatorForPosition($request);
        if($validator->fails()) return response()->json([
            'message' => 'invalid position'
        ],422);
        $positionId = $validator->validated()['position_id'];
        if(!$this->positionOwner($request, $positionId)) {
            return response()->json([
                'message' => 'not position owner'
            ],403);
        }
        $position = CartProduct::find($positionId);
        $position->delete();
        return response()->json([
            'message' => 'position deleted'
        ]);
    }

    function incrementPosition(Request $request) {
        
    }

    function decrementPosition(Request $request) {
        
    }

    function getPositions(Request $request) {
        $cart = $request->cart;
        $emptyResponse = response()->json([],404);
        if($cart === null) return $emptyResponse;
        $positions = $cart->positions;
        if(count($positions)===0) return $emptyResponse;
        $positions = $cart->positions()
        ->leftJoin('products','cart_product.product_id','products.id')
        ->leftJoin('sizes','cart_product.size_id','sizes.id')
        ->leftJoin('colors', 'products.color_id', 'colors.id')
        ->select('cart_product.id as position_id', 'cart_product.count as count' ,'products.*', 'colors.name as color','sizes.name as size')
        ->get();
        return response()->json($positions);
    }

    function getPositionIds(Request $request) {
        $cart = $request->cart;
        $emptyResponse = response()->json([],404);
        if($cart === null) return $emptyResponse;
        $positions = $cart->positions()->
        orderBy('product_id','asc')->get();
        if(count($positions)===0) return $emptyResponse;
        $ids = [];
        foreach($positions as $position) {
            if(!isset($ids[$position->product_id])) {
                $ids[$position->product_id] = [];
            }
            $ids[$position->product_id][$position->size->name] = true;

        }
        return response()->json($ids);
    }

    private function validatorForPosition($request) {
        $validator = Validator::make($request->all(),[
            'position_id' => 'required|integer|min:1'
        ]);
        return $validator;
    }
    private function positionOwner($request, $positionId) {
        $position = CartProduct::find($positionId);
        if($position === null) return false;
        $cart = $request->cart;
        if($cart === null) return false;
        return $position->cart_id === $cart->id;
    }
}
