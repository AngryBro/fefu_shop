<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DebugController;
use App\Http\Controllers\FavouriteController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SubscribeController;
use App\Http\Controllers\UserDataController;
use App\Http\Controllers\InfoPageController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ColorController;


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
Route::get('/infopage.get',[InfoPageController::class, 'get']);

Route::middleware(App\Http\Middleware\Authorized::class)->group(function(){

    Route::post('/logout',[AuthController::class, 'logout']);
    Route::post('/favourite.add', [FavouriteController::class, 'addProduct']);
    Route::post('/favourite.delete', [FavouriteController::class, 'deleteProduct']);
    Route::get('/favourite.getIds',[FavouriteController::class, 'getIds']);
    Route::get('/favourite.get',[FavouriteController::class, 'get']);
    Route::post('/subscribes.create',[SubscribeController::class, 'create']);
    Route::get('/subscribes.get',[SubscribeController::class, 'get']);
    Route::get('/subscribes.count',[SubscribeController::class, 'count']);
    Route::get('/subscribes.getIds',[SubscribeController::class, 'getIds']);
    Route::post('/order.create', [OrderController::class, 'create']);
    Route::post('/mydata.set', [UserDataController::class, 'set']);
    Route::get('/mydata.get', [UserDataController::class, 'get']);

    Route::middleware(App\Http\Middleware\Admin::class)->group(function(){
        Route::get('/order.get', [OrderController::class, 'get']);
        Route::get('/orders.all', [OrderController::class, 'all']);
        Route::post('/infopage.update', [InfoPageController::class, 'update']);
        Route::post('/infopage.create', [InfoPageController::class, 'create']);
        Route::get('/users.all', [UserDataController::class, 'all']);
        Route::get('/admins.all', [AdminController::class, 'admins']);
        Route::get('/admin.get', [AdminController::class, 'get']);
        Route::post('/admin.update', [AdminController::class, 'update']);
        Route::post('/admin.delete', [AdminController::class, 'delete']);
        Route::post('/admin.create', [AdminController::class, 'create']);
        Route::get('/user.get', [UserDataController::class, 'getAny']);
        Route::get('/colors.all', [ColorController::class, 'all']);
        Route::post('/color.create', [ColorController::class, 'create']);
        Route::post('/color.update', [ColorController::class, 'update']);
        Route::post('/color.delete', [ColorController::class, 'delete']);
        Route::get('/categories.all', [CatalogController::class, 'categoriesAll']);
        Route::post('/category.update', [CatalogController::class, 'categoryUpdate']);
        Route::post('/category.create', [CatalogController::class, 'categoryCreate']);
        Route::post('/category.addChild', [CatalogController::class, 'addChildcategory']);
        Route::post('/category.deleteChild', [CatalogController::class, 'deleteChildcategory']);
        // Route::post('/')
    });
});
Route::middleware(App\Http\Middleware\AuthOrSessionOptional::class)->group(function(){
    Route::middleware(App\Http\Middleware\CartAction::class)->group(function(){
        Route::post('/cart.add',[CartController::class, 'addPosition']);
        Route::get('/cart.getIds',[CartController::class, 'getPositionIds']);
        Route::get('/cart.get',[CartController::class, 'getPositions']);
    });
});
Route::middleware(App\Http\Middleware\AuthOrSessionRequired::class)->group(function(){
    Route::middleware(App\Http\Middleware\CartAction::class)->group(function(){
        Route::post('/cart.increment',[CartController::class, 'incrementPosition']);
        Route::post('/cart.decrement',[CartController::class, 'decrementPosition']);
        Route::post('/cart.delete',[CartController::class, 'deletePosition']);
    });


});
