<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Rules\PhoneNumber;
use Validator;

class AdminController extends Controller
{
    function get(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid id'
        ],422);
        $data = $validator->validated();
        $admin = User::where('id', $data['id'])
        ->where('role_id', Role::firstWhere('name',Role::ADMIN)->id)
        ->first();
        if($admin === null) return response()->json([
            'message' => 'no admin with this id'
        ],400);
        return response()->json($admin);
    }

    function admins(Request $request) {
        $users = User::query()
        ->where('role_id',Role::firstWhere('name',Role::ADMIN)->id)
        ->orderBy('id', 'desc')
        ->get();
        if(count($users)===0) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json($users);
    }

    function create(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|min:3',
            'email' => 'required|email',
            'phone_number' => ['required', new PhoneNumber]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $admin = User::where(function($query) use($data){
            $query->where('email', $data['email'])
            ->orWhere('phone_number', $data['phone_number']);
        })->first();
        if($admin !== null) return response()->json([
            'message' => 'user with this email or phone number exists'
        ], 400);
        $admin = new User;
        foreach($data as $key => $value) {
            $admin->$key = $value;
        }
        $admin->role_id = Role::firstWhere('name', Role::ADMIN)->id;
        $admin->save();
        return response()->json([
            'message' => 'admin created'
        ]);
    }

    function update(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'string|min:3',
            'email' => 'email',
            'id' => 'required|integer'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $admin = User::where('id', $data['id'])
        ->where('role_id', Role::firstWhere('name',Role::ADMIN)->id)
        ->first();
        if($admin === null) return response()->json([
            'message' => 'no admin with this id'
        ],400);
        unset($data['id']);
        foreach($data as $key => $value) {
            $admin->$key = $value;
        }
        $admin->save();
        return response()->json([
            'message' => 'admin data updated'
        ]);
    }

    function delete(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $admin = User::where('id', $data['id'])
        ->where('role_id', Role::firstWhere('name',Role::ADMIN)->id)
        ->first();
        if($admin === null) return response()->json([
            'message' => 'no admin with this id'
        ],400);
        $admin->delete();
        return response()->json([
            'message' => 'admin deleted'
        ]);
    }

}
