<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Contact;
use App\Rules\ContactId;

class ContactController extends Controller
{
    function get() {
        return response()->json(Contact::all());
    }

    function update(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => ['required', new ContactId],
            'name' => 'string',
            'value' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $contact = Contact::find($data['id']);
        unset($data['id']);
        foreach($data as $key => $value) {
            $contact->$key = $value;
        }
        $contact->save();
        return response()->json([
            'message' => 'contact updated'
        ]);
    }
}
