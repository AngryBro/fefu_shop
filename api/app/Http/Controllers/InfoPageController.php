<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\InfoPage;

class InfoPageController extends Controller
{
    function get(Request $request) {
        $validator = Validator::make($request->all(),[
            'slug' => 'required|string'
        ]);
        if($validator->fails()) return response([
            'message' => 'no slug'
        ],422);
        $slug = $validator->validated()['slug'];
        $page = InfoPage::firstWhere('slug', $slug);
        if($page === null) return response()->json([],404);
        $page = $page->toArray();
        $page['images'] = json_decode($page['images'], false);
        return response()->json($page);
    }

    function update(Request $request) {
        $validator = Validator::make($request->all(),[
            'page_id' => 'required|integer',
            'text1' => 'string',
            'text2' => 'string',
            'header' => 'string',
            'image_header' => 'string',
            'images' => 'array',
            'hidden' => 'boolean',
            'slug' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $page = InfoPage::find($data['page_id']);
        if($page === null) return response()->json([
            'message' => 'no page'
        ],400);
        unset($data['page_id']);
        foreach($data as $key => $value) {
            $page->$key = $key==='images'?json_encode($value):$value;
        }
        $page->save();
        return response()->json([
            'message' => 'page updated'
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
        $page = InfoPage::firstWhere('slug',$data['slug']);
        if($page === null) {
            $page = InfoPage::firstWhere('header',$data['header']);
        }
        if($page !== null) return response()->json([
            'message' => 'page with such slug or header exists'
        ],400);
        $page = new InfoPage;
        foreach($data as $key => $value) {
            $page->$key = $key==='images'?json_encode($value):$value;
        }
        $page->save();
        return response()->json([
            'message' => 'page created'
        ]);
    }
}
