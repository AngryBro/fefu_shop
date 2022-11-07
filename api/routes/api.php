<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DebugController;
use App\Http\Controllers\FavouriteController;
use App\Http\Controllers\CartController;


Route::any('/debug',[DebugController::class, 'debug']);
// ->middleware(App\Http\Middleware\AuthOrSession::class);
Route::post('/products.get',[CatalogController::class, 'products']);
Route::get('/product.get',[CatalogController::class, 'product']);
Route::get('/img/products/{id}/{file}',[CatalogController::class,'image'])
->name('productImage');
Route::get('/products.meta', [CatalogController::class, 'productsMeta']);
Route::post('/sms.send', [AuthController::class, 'sendSms']);
Route::post('/sms.verify', [AuthController::class, 'verifySms'])
->middleware(App\Http\Middleware\SessionRequired::class);
Route::middleware(App\Http\Middleware\Authorized::class)->group(function(){
    Route::post('/logout',[AuthController::class, 'logout']);
    Route::post('/favourite.add', [FavouriteController::class, 'addProduct']);
    Route::post('/favourite.delete', [FavouriteController::class, 'deleteProduct']);
    Route::get('/favourite.getIds',[FavouriteController::class, 'getIds']);
    Route::get('/favourite.get',[FavouriteController::class, 'get']);
});
Route::middleware(App\Http\Middleware\AuthOrSession::class)->group(function(){
    Route::post('/cart.add',[CartController::class, 'addPosition']);
});
