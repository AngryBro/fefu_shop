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

class CatalogController extends Controller
{
    function products(Request $request) {
        $validator = Validator::make($request->all(),[
            'page' => 'required|integer|min:1',
            'page_size' => 'required|integer|min:1',
            'category_ids' => 'required|array',
            'brand_ids' => 'required|array',
            'size_ids' => 'required|array',
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
        $products = Product::query();
        $products = $this->queryByFiltersAndSort($products, $data);
        if(isset($data['search_string'])) {
            $products = $this->queryBySearchString($products, $data['search_string']);
        }
        $products = $products->paginate($data['page_size']);
        if($products->count()===0) return response()->json([],404);
        return response()->json($products);
    }

    private function queryBySearchString($products, $string) {

        return $products->where(function($query) use($string) {
            $query->whereRaw("POSITION('$string' IN products.name) > 0")
            ->orWhereRaw("POSITION('$string' IN products.article) > 0")
            ->orWhereRaw("POSITION('$string' IN categories.name) > 0")
            ->orWhereRaw("POSITION(products.name IN '$string') > 0")
            ->orWhereRaw("POSITION(products.article IN '$string') > 0")
            ->orWhereRaw("POSITION(categories.name IN '$string') > 0");
        });
    }

    private function queryByFiltersAndSort($products,$data) {

        if($data['sort_new']) {
            $products = $products->orderBy('new','desc');
        }
        $products = $products->leftJoin('categories',
        'categories.id','products.category_id')
        ->leftJoin('colors', 'products.color_id','colors.id')
        ->leftJoin('brands', 'products.brand_id','brands.id')
        ->leftJoin('sizes', 'products.size_id','sizes.id')
        ->leftJoin('materials', 'products.material_id','materials.id')
        // ->leftJoin('', 'products._id','.id')
        ->whereIn('category_id',$data['category_ids'])
        ->where('price_discount','>',$data['price_min'])
        ->where('price_discount','<',$data['price_max'])
        ->whereIn('brand_id',$data['brand_ids'])
        ->whereIn('size_id',$data['size_ids'])
        ->whereIn('color_id',$data['color_ids'])
        ->whereIn('material_id',$data['material_ids'])
        ->orderBy('price_discount',$data['sort_price']?'asc':'desc')
        ->select('products.id',
        'products.name',
        'products.images',
        'products.article',
        'products.price',
        'products.discount',
        'products.price_discount',
        'products.description',
        'products.count',
        'products.onfitting',
        'products.new',
        'colors.name as color_name',
        'colors.rgb as color_rgb',
        'colors.article as color_article',
        'sizes.name as size',
        'sizes.description as size_description',
        'brands.name as brand',
        'materials.name as material',
        'categories.name as category'
        );
        return $products;
    }

    function productsMeta() {
        $categories = Category::select('id','name')->get();
        $brands = Brand::select('id','name')->get();
        $sizes = Size::select('id','name','description')->get();
        $materials = Material::select('id','name')->get();
        $colors = Color::select('id','name','rgb','article')->get();
        $price_min = Product::query()
        ->min('price_discount');
        $price_max = Product::query()
        ->max('price');
        return response()->json([
            'categories' => $categories,
            'brands' => $brands,
            'sizes' => $sizes,
            'materials' => $materials,
            'colors' => $colors,
            'price_min' => $price_min,
            'price_max' => $price_max
        ]);
    }

}
