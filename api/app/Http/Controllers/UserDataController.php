<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\User;
use App\Models\Role;

class UserDataController extends Controller
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
        $users = User::query()
        ->where('role_id',Role::firstWhere('name',Role::USER)->id)
        ->paginate($data['page_size']);
        if($users->count()===0) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json($users);
    }

    function getAny(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid user id'
        ],422);
        $id = $validator->validated()['id'];
        $user = User::find($id);
        if($user === null) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json($user);
    }

    function get(Request $request) {
        $user = $request->user;
        return response()->json([
            'name' => $user->name,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'role' => $user->role->name
        ]);
    }
    function set(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'string|min:3',
            'email' => 'email'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $user = $request->user;
        if(isset($data['name'])) {
            $user->name = $data['name'];
        }
        if(isset($data['email'])) {
            $user->email = $data['email'];
        }
        $user->save();
        return response()->json([
            'message' => 'user data updated'
        ]);
    }
}
