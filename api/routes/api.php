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
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CallbackController;
use App\Http\Controllers\ShopConfigController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\AdminCatalogController;


// Route::any('/debug',[DebugController::class, 'debug']);
Route::post('/products.get',[CatalogController::class, 'products']);
Route::get('/product.get',[CatalogController::class, 'product']);
Route::get('/products.new',[CatalogController::class, 'getNew']);

Route::get('/products.meta', [CatalogController::class, 'productsMeta']);
Route::post('/sms.send', [AuthController::class, 'sendSms']);
Route::post('/sms.verify', [AuthController::class, 'verifySms'])
->middleware(App\Http\Middleware\SessionRequired::class);
Route::get('/infopage.get',[InfoPageController::class, 'get']);
Route::get('/contacts.get', [ContactController::class, 'get']);
Route::get('/shopConfig.get', [ShopConfigController::class, 'get']);
Route::post('/callbacks.create', [CallbackController::class, 'create']);
Route::get('/img.get', [ImageController::class, 'get']);
Route::get('/infopages.all', [InfoPageController::class, 'allUser']);

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
        Route::get('/admin/infopage.get', [InfoPageController::class, 'getAdmin']);
        Route::post('/infopage.update', [InfoPageController::class, 'update']);
        Route::post('/infopage.create', [InfoPageController::class, 'create']);
        Route::post('/infopage.delete', [InfoPageController::class, 'delete']);
        Route::get('/admin/infopages.all', [InfoPageController::class, 'allAdmin']);
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
        Route::get('/categories.all', [AdminCatalogController::class, 'categories']);
        Route::post('/category.update', [AdminCatalogController::class, 'categoryUpdate']);
        Route::post('/category.create', [AdminCatalogController::class, 'categoryCreate']);
        Route::post('/category.addChild', [AdminCatalogController::class, 'addChildCategory']);
        Route::post('/category.deleteChild', [AdminCatalogController::class, 'deleteChildCategory']);
        Route::get('/admin/product.get',[AdminCatalogController::class, 'product']);
        Route::get('/admin/products.search',[AdminCatalogController::class, 'productsSearch']);
        Route::post('/product.update', [AdminCatalogController::class, 'productUpdate']);
        Route::post('/product.create', [AdminCatalogController::class, 'productCreate']);
        Route::post('/contacts.update', [ContactController::class, 'update']);
        Route::get('/shopConfig.getAll', [ShopConfigController::class, 'getAll']);
        Route::post('/shopConfig.update', [ShopConfigController::class, 'update']);
        Route::get('/callbacks.get', [CallbackController::class, 'get']);
        Route::post('/img.upload', [ImageController::class, 'upload']);
    });
});
Route::middleware(App\Http\Middleware\AuthOrSessionOptional::class)->group(function(){
    Route::middleware(App\Http\Middleware\CartAction::class)->group(function(){
        Route::post('/cart.add',[CartController::class, 'addPosition']);
        Route::get('/cart.getIds',[CartController::class, 'getPositionIds']);
        Route::get('/cart.get',[CartController::class, 'getPositions']);
        Route::get('/cart.info',[CartController::class, 'info']);
    });
});
Route::middleware(App\Http\Middleware\AuthOrSessionRequired::class)->group(function(){
    Route::middleware(App\Http\Middleware\CartAction::class)->group(function(){
        Route::post('/cart.increment',[CartController::class, 'incrementPosition']);
        Route::post('/cart.decrement',[CartController::class, 'decrementPosition']);
        Route::post('/cart.delete',[CartController::class, 'deletePosition']);
    });


});
