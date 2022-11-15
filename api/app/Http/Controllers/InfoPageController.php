<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\InfoPage;
use App\Models\Role;

class InfoPageController extends Controller
{
    function allAdmin() {
        $pages = InfoPage::select('id','header','slug', 'hidden')->get();
        return response()->json($pages);
    }

    function allUser() {
        $pages = InfoPage::select('id','header','slug')->where('hidden',false)->get();
        return response()->json($pages);
    }

    function getAdmin(Request $request) {
        $validator = Validator::make($request->all(),[
            'slug' => 'required|string'
        ]);
        if($validator->fails()) return response([
            'message' => 'no slug'
        ],422);
        $slug = $validator->validated()['slug'];
        $page = InfoPage::firstWhere('slug', $slug);
        $badResponse = response()->json([
            'message' => 'not found'
        ],404);
        if($page === null) return $badResponse; 
        $page = $page->toArray();
        $page['images'] = json_decode($page['images'], false);
        return response()->json($page);
    }

    function get(Request $request) {
        $validator = Validator::make($request->all(),[
            'slug' => 'required|string'
        ]);
        if($validator->fails()) return response([
            'message' => 'no slug'
        ],422);
        $slug = $validator->validated()['slug'];
        $page = InfoPage::where('slug', $slug)
        ->where('hidden', false)
        ->first();
        $badResponse = response()->json([
            'message' => 'not found'
        ],404);
        if($page === null) return $badResponse; 
        $page = $page->toArray();
        $page['images'] = json_decode($page['images'], false);
        return response()->json($page);
    }

    function update(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer',
            'text1' => 'string',
            'text2' => 'string',
            'header' => 'string',
            'image_header' => 'string',
            'images' => 'array',
            'images.*' => 'string',
            'hidden' => 'boolean',
            'slug' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $page = InfoPage::find($data['id']);
        if($page === null) return response()->json([
            'message' => 'no page'
        ],400);
        unset($data['id']);
        if(isset($data['images'])) {
            $page->images = json_encode($data['images']);
            unset($data['images']);
        }
        foreach($data as $key => $value) {
            $page->$key = $value;
        }
        $page->save();
        return response()->json([
            'message' => 'page updated'
        ]);
    }

    function delete(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $id = $validator->validated()['id'];
        $page = InfoPage::find($id);
        if($page !== null) {
            $page->delete();
        }
        return response()->json([
            'message' => 'page deleted'
        ]);
    }

    function create(Request $request) {
        $validator = Validator::make($request->all(),[
            'text1' => 'required|string',
            'text2' => 'required|string',
            'header' => 'required|string',
            'image_header' => 'required|string',
            'images' => 'required|array',
            'slug' => 'required|string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $data['hidden'] = true;
        $page = InfoPage::where(function($query) use($data){
            $query->where('slug', $data['slug'])
            ->orWhere('header', $data['header']);
        })->first();
        if($page !== null) return response()->json([
            'message' => 'page with such slug or header exists'
        ],400);
        $images = $data['images'];
        unset($data['images']);
        $page = new InfoPage;
        foreach($data as $key => $value) {
            $page->$key = $value;
        }
        $page->images = json_encode($images);
        $page->save();
        return response()->json([
            'message' => 'page created'
        ]);
    }
}
