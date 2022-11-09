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
        if($size !== null) {
            $sizeName = $size->name;
        }
        $product = Product::find($data['product_id']);
        if($size===null || $product===null) {
            return response()->json([
                'message' => 'no such product or size'
            ],400);
        }
        elseif(!($product->$sizeName>0)) {
            return response()->json([
                'message' => 'product count is 0'
            ],400);
        }
        $cart = $request->cart;
        $position = new CartProduct;
        $position->product_id = $data['product_id'];
        $position->size_id = $data['size_id'];
        $position->count = 1;
        $newSession = false;
        if($cart !== null) {
            $positionOld = CartProduct::query()
            ->where('product_id',$data['product_id'])
            ->where('size_id',$data['size_id'])
            ->where('cart_id', $cart->id)
            ->first();
            if($positionOld !== null) {
                return response()->json([
                    'message' => 'this position is already in cart'
                ],400);
            }
        }
        else {
            $cart = new Cart;
            if($request->user !== null) {
                $cart->user_id = $request->user->id;
            }
            elseif($request->xsession !== null) {
                $cart->session_id = $request->xsession->id;
            }
            else {
                $newSession = true;
                $session = new Session;
                $session->token = Session::generateToken();
                $session->save();
                $cart->session_id = $session->id;
            }
            $cart->save();
        }
        $position->cart_id = $cart->id;
        $position->save();
        return response()->json(
            $newSession?[
                'session' => $session->token,
                'message' => 'cart created ,position added'
            ]:
            [
                'message' => 'position added'
            ]
        );
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
        $validator = $this->validatorForPosition($request);
        if($validator->fails()) return response()->json([
            'message' => 'invalid position'
        ],422);
        $positionId = $validator->validated()['position_id'];
        $cart = $request->cart;
        if(!$this->positionOwner($request, $positionId)) {
            return response()->json([
                'message' => 'not position owner'
            ],403);
        }
        $position = CartProduct::find($positionId);
        $size = $position->size->name;
        $productCount = $position->product->$size;
        if(($productCount === null)||($position->count+1 > $productCount)) {
            return response()->json([
                'message' => 'max count'
            ],400);
        }
        $position->count++;
        $position->save();
        return response()->json([
            'message' => 'position incremented'
        ]);
    }

    function decrementPosition(Request $request) {
        $validator = $this->validatorForPosition($request);
        if($validator->fails()) return response()->json([
            'message' => 'invalid position'
        ],422);
        $positionId = $validator->validated()['position_id'];
        $cart = $request->cart;
        if(!$this->positionOwner($request, $positionId)) {
            return response()->json([
                'message' => 'not position owner'
            ],403);
        }
        $position = CartProduct::find($positionId);
        $size = $position->size->name;
        if($position->count === 1) {
            return response()->json([
                'message' => 'min count 1'
            ],400);
        }
        $position->count--;
        $position->save();
        return response()->json([
            'message' => 'position count decremented'
        ]);
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
        $positionIds = [];
        foreach($positions as $position) {
            $size = $position->size->name;
            $positionIds[$position->id] = $position->product->$size>0;;
            if(!isset($ids[$position->product_id])) {
                $ids[$position->product_id] = [];
            }
            $ids[$position->product_id][$size] = true;

        }

        return response()->json([
            'product_ids' => $ids,
            'positions_ids' => $positionIds
        ]);
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
