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
use App\Models\UpperCategory;
use DB;

class CatalogController extends Controller
{
    function productUpdate(Request $request) {

    }

    function categoriesAll() {
        $upperCategories = UpperCategory::all();
        foreach($upperCategories as $upperCategory) {
            $upperCategory->categoriesAll;
        }
        return response()->json($upperCategories);
    }

    function categoryUpdate(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer',
            'name' => 'string|min:3',
            'upper' => 'boolean'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
    }

    function product(Request $request) {
        $validator = Validator::make($request->all(),[
            'id' => 'required|integer|min:1'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'incorrect id'
        ],422);
        $id = $validator->validated()['id'];
        $product = Product::query()
        ->select('products.*',
        'colors.name as color_name',
        'colors.rgb as color_rgb',
        'colors.article as color_article',
        'brands.name as brand',
        'materials.name as material',
        'categories.name as category'
        )
        ->where('products.id',$id)
        ->where('show',true)
        ->leftJoin('categories',
        'categories.id','products.category_id')
        ->leftJoin('colors', 'products.color_id','colors.id')
        ->leftJoin('brands', 'products.brand_id','brands.id')
        ->leftJoin('materials', 'products.material_id','materials.id')
        ->first();
        if($product === null) return response()->json([
            'message' => 'not found'
        ],404);
        $images = DB::table('product_image')
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
        $products = Product::query()->where('show',true);
        $products = $this->queryByFiltersAndSort($products, $data);
        if(isset($data['search_string'])) {
            $products = $this->queryBySearchString($products, $data['search_string']);
        }
        $products = $products->paginate($data['page_size']);
        if($products->count()===0) return response()->json([],404);
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
        ->whereIn('products.brand_id',$data['brand_ids']);
        foreach($data['sizes'] as $size) {
            $products = $products->where("products.$size", '<>', null);
        }
        $products = $products
        ->whereIn('products.color_id',$data['color_ids'])
        ->whereIn('products.material_id',$data['material_ids'])
        ->orderBy('products.price_discount',$data['sort_price']?'asc':'desc');
        
        return $products;
    }

    function productsMeta() {
        $upperCategories = UpperCategory::where('show',true)->get();
        $brands = Brand::select('id','name')->get();
        $sizes = Size::select('id','name','description')->get();
        $materials = Material::select('id','name')->get();
        $colors = Color::select('id','name','rgb','article')->get();
        $price_min = Product::query()
        ->min('price_discount');
        $price_max = Product::query()
        ->max('price');
        foreach($upperCategories as $upperCategory) {
            $upperCategory->categoriesToShow;
        }
        $data = [
            'brands' => $brands,
            'sizes' => $sizes,
            'materials' => $materials,
            'colors' => $colors,
            'price_min' => $price_min,
            'price_max' => $price_max,
            'upper_categories' => $upperCategories
        ];
        return response()->json($data);
    }

}
