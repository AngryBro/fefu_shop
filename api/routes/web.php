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

// Route::get('/debug', function() {
//     $order = Order::find(1);
//     Mail::to('angry.bro.v.2013@gmail.com')->send(new OrderMail($order));
// });

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
