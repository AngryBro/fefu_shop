<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\SmsCode;
use App\Models\Session;
use Str;
use Carbon\Carbon;
use App\Rules\PhoneNumber;

class AuthController extends Controller
{

    function sendSms(Request $request) {
        $validator = Validator::make($request->all(),[
            'phone_number' => [
                'required',
                // new PhoneNumber
            ]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid phone number'
        ],422);
        $currentSession = $request->header('X-Session');
        $phone_number = $validator->validated()['phone_number'];
        $sent_sms_code = SmsCode::query()
        ->where('phone_number',$phone_number)
        ->first();
        if($sent_sms_code === null) {
            $sent_sms_code = new SmsCode;
            $sent_sms_code->phone_number = $phone_number;
        }
        else {
            $updated = new Carbon($sent_sms_code->updated_at);
            $now = Carbon::now();
            if($updated->greaterThan($now->subMinutes(10))) {
                return response()->json([
                    'message' => 'already sent'
                ],400);
            }
        }
        if($currentSession === null) {
            $session = new Session;
            $currentSession = Str::random(64);
            $session->token = $currentSession;
            $session->save();
        }
        $session_id = Session::where('token',$currentSession)
        ->first()->id;
        $sms_code = random_int(10000,99999);
        $sent_sms_code->session_id = $session_id;
        $sent_sms_code->code = $sms_code;
        $sent_sms_code->expires_at = Carbon::now()->addMinutes(10);
        $sent_sms_code->save();
        return response()->json([
            'sms_code' => $sms_code,
            'session' => $currentSession
        ]);
    }



}
