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
            'size' => 'required|string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid id or size'
        ],422);
        $data = $validator->validated();
        $size = Size::firstWhere('name', $data['size']);
        if($size !== null) {
            $sizeName = $size->name;
        }
        $product = Product::where('id', $data['product_id'])->where('show', true)->first();
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
        $position->size = $sizeName;
        $position->count = 1;
        $newSession = false;
        if($cart !== null) {
            $positionOld = CartProduct::query()
            ->where('product_id',$data['product_id'])
            ->where('size',$sizeName)
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
                'message' => 'cart created, position added'
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
        $size = $position->size;
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
        $size = $position->size;
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
        ->leftJoin('colors', 'products.color_id', 'colors.id')
        ->leftJoin('brands', 'products.brand_id', 'brands.id')
        ->leftJoin('categories', 'products.category_id', 'categories.id')
        ->select('cart_product.id as position_id', 'cart_product.count as count' ,'products.*', 'colors.name as color','cart_product.size as size', 'brands.name as brand', 'categories.name as category')
        ->get();
        return response()->json($positions);
    }

    function info(Request $request) {
        $cart = $request->cart;
        $count = 0;
        $sum = 0;
        if($cart === null) return response()->json([
            'count' => $count,
            'sum' => $sum
        ]);
        foreach($cart->positions as $position) {
            $count++;
            $sum += $position->count * $position->product->price_discount;
        }
        return response()->json([
            'count' => $count,
            'sum' => $sum
        ]);
    }

    function getPositionIds(Request $request) {
        $cart = $request->cart;
        $emptyResponse = response()->json([
            'product_ids' => [],
            'position_ids' => []
        ]);
        if($cart === null) return $emptyResponse;
        $positions = $cart->positions()->
        orderBy('product_id','asc')->get();
        if(count($positions)===0) return $emptyResponse;
        $ids = [];
        $positionIds = [];
        foreach($positions as $position) {
            $size = $position->size;
            $positionIds[$position->id] = $position->product->$size>0;;
            if(!isset($ids[$position->product_id])) {
                $ids[$position->product_id] = [];
            }
            $ids[$position->product_id][$size] = true;

        }

        return response()->json([
            'product_ids' => $ids,
            'position_ids' => $positionIds
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
