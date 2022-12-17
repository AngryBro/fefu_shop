<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Rules\ProductId;
use App\Rules\CategoryId;
use App\Rules\BrandId;
use App\Rules\MaterialId;
use App\Rules\ColorId;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\CategoriesRelation;
use Validator;

class AdminCatalogController extends Controller
{
    function productsSearch(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'string',
            'category_id' => [new CategoryId],
            'page_size' => 'required|integer|min:1',
            'page' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $product = Product::select('products.*','categories.name as category')
        ->leftJoin('categories', 'categories.id', 'products.category_id')
        ->orderBy('products.id', 'desc');
        if(isset($data['name'])) {
            $product = $product->where(function($query)use($data){
                $query->where('products.name', $data['name'])
                ->orWhere('products.slug', $data['name']);
            });
        }
        if(isset($data['category_id'])) {
            $product = $product->where('products.category_id', $data['category_id']);
        }
        $products = $product->paginate($data['page_size']);
        return response()->json($products);
    }

    function product(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => ['required', new ProductId]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid id'
        ],422);
        $id = $validator->validated()['id'];
        $product = Product::select('products.*', 'categories.name as category', 'brands.name as brand', 'materials.name as material', 'colors.name as color_name', 'colors.rgb as color_rgb')
        ->where('products.id', $id)
        ->leftJoin('categories', 'categories.id', 'products.category_id')
        ->leftJoin('brands', 'brands.id', 'products.brand_id')
        ->leftJoin('materials', 'materials.id', 'products.material_id')
        ->leftJoin('colors', 'colors.id', 'products.color_id')
        ->first();
        $product->images;
        return response()->json($product);
    }

    function productUpdate(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => ['required', new ProductId],
            'name' => 'string',
            'slug' => 'string',
            'article' => 'string',
            'image_preview' => 'string',
            'price' => 'integer',
            'discount' => 'integer',
            'description' => 'string',
            'XS' => 'integer|nullable',
            'S' => 'integer|nullable',
            'M' => 'integer|nullable',
            'L' => 'integer|nullable',
            'XL' => 'integer|nullable',
            'show' => 'boolean',
            'color_id' => [new ColorId],
            'brand_id' => [new BrandId],
            'material_id' => [new MaterialId],
            'category_id' => [new CategoryId],
            'images' => 'array',
            'images.*' => 'string',
            'delete_images' => 'array',
            'delete_images.*' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $product = Product::find($data['id']);
        if(isset($data['delete_images'])) {
            $deleteImages = $data['delete_images'];
            unset($data['delete_images']);
            foreach($deleteImages as $image) {
                $imageModel = ProductImage::firstWhere('image', $image);
                if($imageModel !== null) {
                    $imageModel->delete();
                }
            }
        }
        if(isset($data['images'])) {
            $images = $data['images'];
            unset($data['images']);
            foreach($images as $image) {
                $imageModel = new ProductImage;
                $imageModel->product_id = $data['id'];
                $imageModel->image = $image;
                $imageModel->save();
            }
        }
        unset($data['id']);
        if(!isset($data['price'])) {
            $data['price'] = $product->price;
        }
        if(!isset($data['discount'])) {
            $data['discount'] = $product->discount;
        }
        $data['price_discount'] = $data['price'] - $data['discount'];
        foreach($data as $key => $value) {
            $product->$key = $value;
        }
        $product->save();
        return response()->json([
            'message' => 'product updated'
        ]);
    }

    function productCreate(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|min:2',
            'name_internal' => 'required|string|min:2',
            'article' => 'required|string|min:3',
            'image_preview' => 'required|string',
            'price' => 'required|integer',
            'discount' => 'required|integer',
            'description' => 'required|string',
            'XS' => 'integer',
            'S' => 'integer',
            'M' => 'integer',
            'L' => 'integer',
            'XL' => 'integer',
            'color_id' => ['required', new ColorId],
            'brand_id' => ['required', new BrandId],
            'material_id' => ['required', new MaterialId],
            'category_id' => ['required', new CategoryId],
            'images' => 'array',
            'images.*' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $oldProducts = Product::query()
        ->where(function($query) use($data){
            $query->where('name', $data['name'])
            ->orWhere('name_internal', $data['name_internal'])
            ->orWhere('article', $data['article']);
        })->get();
        if(count($oldProducts)>0) return response()->json([
            'message' => 'such products already exist',
            'products' => $oldProducts
        ],400);
        $data['price_discount'] = $data['price']-$data['discount'];
        $images = isset($data['images'])?$data['images']:null;
        unset($data['images']);
        $product = new Product;
        foreach($data as $key => $value) {
            $product->$key = $value;
        }
        $product->new = true;
        $product->show = false;
        $lastProducts = Product::query()
        ->orderBy('id','desc')
        ->take(10)->get();
        if(count($lastProducts)>=10) {
            $lastProduct = $lastProducts[9];
            $lastProduct->new = false;
            $lastProduct->save();
        }
        $product->save();
        if($images !== null) {
            foreach($images as $image) {
                $imageModel = new ProductImage;
                $imageModel->product_id = $product->id;
                $imageModel->image = $image;
                $imageModel->save();
            }
        }
        return response()->json([
            'message' => 'product created'
        ]);
    }

    function categories() {
        $categories = Category::all();
        $categoriesTree = [];
        foreach($categories as $category) {
            $category->childrenAll;
            $category->parentsAll;
        }
        return response()->json($categories);
    }

    function deleteChildCategory(Request $request) {
        $validator = Validator::make($request->all(),[
            'child_id' => ['required', new CategoryId]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $child_id = $validator->validated()['child_id'];
        $relation = CategoriesRelation::firstWhere('child_id',$child_id);
        if($relation !== null) {
            $relation->delete();
        }
        return response()->json([
            'message' => 'relation deleted'
        ]);
    }

    function addChildCategory(Request $request) {
        $validator = Validator::make($request->all(),[
            'child_id' => ['required', new CategoryId],
            'parent_id' => ['required', new CategoryId]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $relation = CategoriesRelation::query()
        ->where('child_id', $data['child_id'])
        ->first();
        if($relation !== null) return response()->json([
            'message' => 'relation allready exists'
        ], 400);
        $relation = new CategoriesRelation;
        foreach($data as $key => $value) {
            $relation->$key = $value;
        }
        $relation->save();
        return response()->json([
            'message' => 'relation created'
        ]);
    }

    function categoryCreate(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|min:3'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $name = $validator->validated()['name'];
        $category = Category::firstWhere('name',$name);
        if($category !== null) return response()->json([
            'message' => 'category with this name exists'
        ], 400);
        $category = new Category;
        $category->name = $name;
        $category->show = false;
        $category->save();
        return response()->json([
            'message' => 'category created'
        ]);
    } 

    function categoryUpdate(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => ['required', new CategoryId],
            'show' => 'boolean',
            'image' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $category = Category::find($data['id']);
        unset($data['id']);
        foreach($data as $key => $value) {
            $category->$key = $value;
        }
        $category->save();
        return response()->json([
            'message' => 'category updated'
        ]);
    }
}
