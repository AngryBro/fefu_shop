<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\SmsCode;
use App\Models\Session;
use Str;
use Carbon\Carbon;
use App\Rules\PhoneNumber;
use App\Models\Role;
use App\Models\BearerToken;
use App\Models\User;
use App\Models\Cart;

class AuthController extends Controller
{

    function logout(Request $request) {
        BearerToken::query()
        ->where('token',$request->bearerToken())
        ->delete();
        return response()->json([
            'message' => 'token deleted',
        ]);
    }

    function sendSms(Request $request) {
        $validator = Validator::make($request->all(),[
            'phone_number' => [
                'required',
                new PhoneNumber
            ]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid phone number'
        ],422);
        $session_token = $request->header('X-Session');
        $phone_number = $validator->validated()['phone_number'];
        $session = Session::firstWhere('token',$session_token);
        if($session!==null) {
            $sent_sms_code = SmsCode::firstWhere('session_id',$session->id);
        }
        else {
            if($request->hasHeader('X-Session')) {
                return response()->json([
                    'message' => 'invalid token'
                ],401);
            }
            $sent_sms_code = SmsCode::firstWhere('phone_number',$phone_number);
            if($sent_sms_code === null) {
                $session = new Session;
                $session->token = Str::random(64);
                $session->save();
            }
            else {
                $session = Session::find($sent_sms_code->session_id);
            }
        }
        if($sent_sms_code === null) {
            $sent_sms_code = new SmsCode;
        }
        else {
            $updated = new Carbon($sent_sms_code->updated_at);
            $now = Carbon::now();
            if($updated->greaterThan($now->subMinutes(1))) {
                return response()->json([
                    'message' => 'already sent'
                ],400);
            }
        }

        $sent_sms_code->phone_number = $phone_number;
        $sent_sms_code->session_id = $session->id;
        $sms_code = (string) random_int(10000,99999);
        $sent_sms_code->code = $sms_code;
        $sent_sms_code->expires_at = Carbon::now()->addMinutes(10);
        $sent_sms_code->save();
        // send code
        return response()->json([
            'sms_code' => $sms_code,
            'session' => $session->token
        ]);
    }

    function verifySms(Request $request) {
        $validator = Validator::make($request->all(),[
            'sms_code' => 'required|integer|min:10000|max:99999'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid sms code'
        ],422);
        $sms_code = $validator->validated()['sms_code'];
        $session_id = Session::query()
        ->where('token', $request->header('X-Session'))
        ->first()
        ->id;
        $sent_code = SmsCode::query()
        ->where('session_id',$session_id)
        ->first();
        $expired = $sent_code === null?true
        :(new Carbon($sent_code->expires_at))
        ->lessThan(Carbon::now());
        if($expired) return response()->json([
            'message' => 'code expired or did not send'
        ],400);
        if($sent_code->code !== $sms_code) {
            return response()->json([
                'message' => 'incorrect code'
            ],403);
        }
        $sent_code->expires_at = Carbon::now();
        $sent_code->save();
        $user = User::query()
        ->where('phone_number',$sent_code->phone_number)
        ->first();
        $newBearerToken = Str::random(64);
        if($user === null) {
            $user = new User;
            $user->phone_number = $sent_code->phone_number;
            $user->role_id = Role::firstWhere('name', Role::USER)->id;
            $user->save();
        }
        // attach cart to user_id
        $bearerToken = new BearerToken;
        $bearerToken->token = $newBearerToken;
        $bearerToken->user_id = $user->id;
        $bearerToken->save();
        $cart = Cart::firstWhere('session_id',$session_id);
        if($cart !== null) {
            $cart->session_id = null;
            $cart->user_id = $user->id;
            $cart->save();
        }
        return response()->json([
            'bearer_token' => $newBearerToken
        ]);
    }

}
