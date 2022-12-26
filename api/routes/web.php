<?php

use Illuminate\Support\Facades\Route;
use App\Models\Order;
use App\Mail\OrderMail;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/static/js/{file}', function($file) {
    return response()->file("../resources/build/static/js/$file");
});
Route::get('/static/css/{file}', function($file) {
    return response()->file("../resources/build/static/css/$file");
});
Route::get('/static/media/{file}', function($file) {
    return response()->file("../resources/build/static/media/$file");
});
Route::get('/{any}', function () {
    return response()->file("../resources/build/index.html");
})->where('any', '.*');
