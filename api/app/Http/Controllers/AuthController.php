<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\SmsCode;
use App\Models\Session;
use Str;

class AuthController extends Controller
{
    private function validatePhoneNumber($phone) {
        return strlen($phone)===11 && $phone[0]===7 && ctype_digit($phone);
    }

    function sendSms(Request $request) {
        $validator = Validator::make($request->all(),[
            'phone_number' => [
                'required',
                function($attribute, $value, $fail) {
                    if(!$this->validatePhoneNumber($value)) {
                        $fail();
                    }
                }
            ]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid phone number'
        ],422);
        $phone_number = $validator->validated()['phone_number'];
        // send sms code
        $session = new Session;
        $token = Str::random(64);
        $session->token = $token;
        $session->save();
    }

}
