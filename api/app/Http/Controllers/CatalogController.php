<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Validator;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Size;
use App\Models\Material;
use App\Models\Color;
use App\Rules\CategoryId;
use App\Rules\ProductId;
use App\Models\CategoriesRelation;
use App\Models\ProductImage;

class CatalogController extends Controller
{
    function productsSearchAdmin(Request $request) {
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
        $product = Product::query();
        if(isset($data['name'])) {
            $product = $product->where(function($query)use($data){
                $query->where('name', $data['name'])
                ->orWhere('name_internal', $data['name']);
            });
        }
        if(isset($data['category_id'])) {
            $product = $product->where('category_id', $data['category_id']);
        }
        $products = $product->paginate($data['page_size']);
        if($products->count()===0) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json($products);
    }

    function productGetAdmin(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => ['required', new ProductId]
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid id'
        ],422);
        $id = $validator->validated()['id'];
        $product = $this->getProductById($id, false);
        $product->images;
        return response()->json($product);
    }

    function productUpdate(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => ['required', new ProductId],
            'name' => 'string',
            'article' => 'string',
            'image_preview' => 'string',
            'price' => 'integer',
            'discount' => 'integer',
            'description' => 'string',
            'XS' => 'integer',
            'S' => 'integer',
            'M' => 'integer',
            'L' => 'integer',
            'XL' => 'integer',
            'show' => 'boolean',
            'color_id' => [new App\Rules\ColorId],
            'brand_id' => [new App\Rules\BrandId],
            'material_id' => [new App\Rules\MaterialId],
            'category_id' => [new CategoryId],
            'images' => 'array'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $product = Product::find($data['id']);
        unset($data['id']);
        $images = isset($data['images'])?$data['images']:null;
        unset($data['images']);
        $data['price_discount'] = $data['price']-$data['discount'];
        foreach($data as $key => $value) {
            $product->$key = $value;
        }
        $product->save();
        if($images !== null) {
            $oldImages = $product->images;
            foreach($oldImages as $oldImage) {
                $oldImage->delete();
            }
            foreach($images as $image) {
                $productImage = new ProductImage;
                $productImage->product_id = $product->id;
                $productImage->image = $image;
                $productImage->save();
            }
        }
        return response()->json([
            'message' => 'product updated'
        ]);
    }

    function productCreate(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string',
            'name_internal' => 'required|string',
            'article' => 'required|string',
            'image_preview' => 'required|string',
            'price' => 'required|integer',
            'discount' => 'required|integer',
            'description' => 'required|string',
            'XS' => 'integer',
            'S' => 'integer',
            'M' => 'integer',
            'L' => 'integer',
            'XL' => 'integer',
            'color_id' => ['required', new App\Rules\ColorId],
            'brand_id' => ['required', new App\Rules\BrandId],
            'material_id' => ['required', new App\Rules\MaterialId],
            'category_id' => ['required', new CategoryId],
            'images' => 'required|array'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $oldProducts = Product::query()
        ->where(function($query){
            $query->where('name', $data['name'])
            ->orWhere('name_internal', $data['name_internal'])
            ->orWhere('article', $data['article']);
        })->get();
        if(count($oldProducts)>0) return response()->json([
            'message' => 'such products already exist',
            'products' => $oldProducts
        ],400);
        $images = isset($data['images'])?$data['images']:null;
        unset($data['images']);
        $product = new Product;
        foreach($data as $key => $value) {
            $product->$key = $value;
        }
        $product->new = true;
        $product->show = false;
        $lastProducts = Product::query()
        ->orderBy('created_at','desc')
        ->take(10);
        if(count($lastProducts)>=10) {
            $lastProduct = $lastProducts[10];
            $lastProduct->new = false;
            $lastProduct->save();
        }
        $product->save();
        return response()->json([
            'message' => 'product created'
        ]);
    }

    function categoriesAll() {
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
            'id' => 'required|integer',
            'show' => 'boolean',
            'image' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $category = Category::find($data['id']);
        if($category === null) return response()->json([
            'message' => 'no this category'
        ], 400);
        unset($data['id']);
        foreach($data as $key => $value) {
            $category->$key = $value;
        }
        $category->save();
        return response()->json([
            'message' => 'category updated'
        ]);
    }

    function product(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'incorrect id'
        ],422);
        $id = $validator->validated()['id'];
        $product = $this->getProductById($id, true);
        if($product === null) return response()->json([
            'message' => 'not found'
        ],404);
        $images = ProductImage::query()
        ->select('image')
        ->where('product_id',$id)
        ->get();
        $otherColors = Product::query()
        ->select('products.id','colors.rgb as color_rgb','colors.name as color_name')
        ->leftJoin('colors','products.color_id','colors.id')
        ->where('products.article',$product->article)
        ->get();
        return response()->json([
            'product' => $product,
            'other_colors' => $otherColors,
            'images' => $images
        ]);
    }

    private function getProductById($id, $show) {
        $product = Product::query()
        ->select('products.*',
        'colors.name as color_name',
        'colors.rgb as color_rgb',
        'colors.article as color_article',
        'brands.name as brand',
        'materials.name as material',
        'categories.name as category'
        )
        ->where('products.id',$id);
        if($show) $product = $product->where('products.show',$show);
        $product = $product
        ->leftJoin('categories',
        'categories.id','products.category_id')
        ->leftJoin('colors', 'products.color_id','colors.id')
        ->leftJoin('brands', 'products.brand_id','brands.id')
        ->leftJoin('materials', 'products.material_id','materials.id')
        ->first();
        return $product;
    }

    function products(Request $request) {
        $validator = Validator::make($request->all(),[
            'page' => 'required|integer|min:1',
            'page_size' => 'required|integer|min:1',
            'category_ids' => 'required|array',
            'brand_ids' => 'required|array',
            'sizes' => 'required|array',
            'material_ids' => 'required|array',
            'color_ids' => 'required|array',
            'price_min' => 'required|integer',
            'price_max' => 'required|integer',
            'sort_new' => 'required|boolean',
            'sort_price' => 'required|boolean',
            'search_string' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $products = Product::query()->where('products.show',true);
        $products = $this->queryByFiltersAndSort($products, $data);
        if(isset($data['search_string'])) {
            $products = $this->queryBySearchString($products, $data['search_string']);
        }
        $products = $products->paginate($data['page_size']);
        if($products->count()===0) return response()->json([
            'message' => 'not found'
        ],404);
        return response()->json($products);
    }

    private function queryBySearchString($products, $string) {

        return $products->select('products.*')
            ->leftJoin('categories','products.category_id','categories.id')
            ->where(function($query) use($string) {
                $query->whereRaw("POSITION('$string' IN products.name) > 0")
                ->orWhereRaw("POSITION('$string' IN products.article) > 0")
                ->orWhereRaw("POSITION('$string' IN categories.name) > 0")
                ->orWhereRaw("POSITION('$string' IN products.name_internal) > 0")
                ->orWhereRaw("POSITION(products.name_internal IN '$string') > 0")
                ->orWhereRaw("POSITION(products.name IN '$string') > 0")
                ->orWhereRaw("POSITION(products.article IN '$string') > 0")
                ->orWhereRaw("POSITION(categories.name IN '$string') > 0");
        });
    }

    private function queryByFiltersAndSort($products,$data) {

        if($data['sort_new']) {
            $products = $products->orderBy('new','desc');
        }
        $products = $products
        ->whereIn('products.category_id',$data['category_ids'])
        ->where('products.price_discount','>',$data['price_min'])
        ->where('products.price_discount','<',$data['price_max'])
        ->whereIn('products.brand_id',$data['brand_ids'])
        ->where(function($query) use($data){
            foreach($data['sizes'] as $size) {
                $query = $query->orWhere("products.$size", '<>', null);
            }
        });
        // foreach($data['sizes'] as $size) {
        //     $products = $products->where("products.$size", '<>', null);
        // }
        $products = $products
        ->whereIn('products.color_id',$data['color_ids'])
        ->whereIn('products.material_id',$data['material_ids'])
        ->orderBy('products.price_discount',$data['sort_price']?'asc':'desc');
        
        return $products;
    }

    function productsMeta() {
        $сategories = Category::where('show',true)->get();
        $brands = Brand::select('id','name')->get();
        $sizes = Size::select('id','name','description')->get();
        $materials = Material::select('id','name')->get();
        $colors = Color::select('id','name','rgb','article')->get();
        $price_min = Product::query()
        ->min('price_discount');
        $price_max = Product::query()
        ->max('price');
        foreach($сategories as $сategory) {
            $сategory->children;
            $сategory->parents;
            
        }
        $data = [
            'brands' => $brands,
            'sizes' => $sizes,
            'materials' => $materials,
            'colors' => $colors,
            'price_min' => $price_min,
            'price_max' => $price_max,
            'categories' => $сategories
        ];
        return response()->json($data);
    }

}
