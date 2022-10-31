<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;


Route::post('/products',[CatalogController::class, 'products']);
Route::get('/img/products/{id}/{file}',[CatalogController::class,'image'])
->name('productImage');