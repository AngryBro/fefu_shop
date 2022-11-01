<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Validator;
use DB;

class CatalogController extends Controller
{
    function productsSearch(Request $request) {
        $validator = Validator::make($request->all(),[
            'string' => 'required|string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'invalid search string'
        ],422);
        $string = $validator->validated()['string'];
        $strings = $this->parseSearchString($string);
        $products = Product::query()
        ->select('products.id',
        'products.name',
        'products.article',
        'categories.name as category'
        );
        return response()->json($strings);
    }

    private function parseSearchString($strings) {
        $strings = explode(' ',$strings);
        $words = [
            'names' => []
        ];
        foreach($strings as $index => $string) {
            $string = trim($string);
            if(strpos('0123456789', $string[0])!==false) {
                $article = '';
                for($i = 0; $i < strlen($string); $i++) {
                    if(is_numeric($string[$i])) {
                        $article.=$string[$i];
                    }
                    else {
                        break;
                    }
                }
                $words['article'] = $article;
            }
            else {
                array_push($words['names'],$string);
            }
        }
        return $words;
    }

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
            'ids' => 'array'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        return $this->getProductsFromDB($data);
    }

    private function getProductsFromDB($data) {
        $products = Product::query();
        if(array_key_exists('ids',$data)) {
            $products = $products->whereIn('id',$data['ids']);
        }
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
        )
        ->paginate($data['page_size']);
        if($products->count()===0) return response()->json([],404);
        return response()->json($products);
    }
}
