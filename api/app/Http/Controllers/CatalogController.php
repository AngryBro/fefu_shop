<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use Validator;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Size;
use App\Models\Material;
use App\Models\Color;
use App\Rules\CategoryId;
use App\Rules\ProductId;
use App\Rules\ColorId;
use App\Rules\BrandId;
use App\Rules\MaterialId;
use App\Models\CategoriesRelation;
use App\Models\ProductImage;
use App\Helpers\ImageUrl;

class CatalogController extends Controller
{

    function getNew() {
        return response()->json(Product::query()
        ->where('new', true)
        ->where('show', true)
        ->orderBy('id','desc')
        ->get()
        );
    }

    function product(Request $request) {
        $validator = Validator::make($request->all(),[
            'slug' => 'required|string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'incorrect slug'
        ],422);
        $slug = $validator->validated()['slug'];
        $product = $this->getProductBySlug($slug, true);
        if($product === null) return response()->json([
            'message' => 'not found'
        ],404);
        $images = ProductImage::query()
        ->select('image')
        ->where('product_id',$product->id)
        ->get();
        $otherColors = Product::query()
        ->select('products.slug','colors.rgb as color_rgb','colors.name as color_name')
        ->leftJoin('colors','products.color_id','colors.id')
        ->where('products.article',$product->article)
        ->whereNot('products.slug','=',$product->slug)
        ->get();
        return response()->json([
            'product' => $product,
            'other_colors' => $otherColors,
            'images' => $images
        ]);
    }

    private function getProductBySlug($slug, $show) {
        $product = Product::query()
        ->select('products.*',
        'colors.name as color_name',
        'colors.rgb as color_rgb',
        'colors.article as color_article',
        'materials.name as material',
        'brands.name as brand',
        'categories.name as category',
        'categories.slug as category_slug'
        )
        ->where('products.slug',$slug);
        if($show) $product = $product->where('products.show',$show);
        $product = $product
        ->leftJoin('colors', 'products.color_id','colors.id')
        ->leftJoin('materials', 'products.material_id','materials.id')
        ->leftJoin('brands', 'products.brand_id', 'brands.id')
        ->leftJoin('categories', 'products.category_id', 'categories.id')
        ->first();
        return $product;
    }

    function products(Request $request) {
        $validator = Validator::make($request->all(),[
            'page' => 'required|integer|min:1',
            'page_size' => 'required|integer|min:1',
            'category_slug' => 'string',
            'sort_new' => 'required|boolean',
            'sort_price' => 'required|integer|min:-1|max:1',
            'search_string' => 'string'
        ]);
        if($validator->fails()) return response()->json([
            'message' => 'validation error'
        ],422);
        $data = $validator->validated();
        $products = Product::query()
            ->select('products.*', 'categories.slug as category_slug')
            ->where('products.show',true)
            ->leftJoin('categories','products.category_id','categories.id');
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

        return $products
            ->where(function($query) use($string) {
                $query->whereRaw("POSITION('$string' IN products.name) > 0")
                ->orWhereRaw("POSITION('$string' IN products.article) > 0")
                ->orWhereRaw("POSITION('$string' IN categories.name) > 0")
                ->orWhereRaw("POSITION('$string' IN products.slug) > 0")
                ->orWhereRaw("POSITION(products.slug IN '$string') > 0")
                ->orWhereRaw("POSITION(products.name IN '$string') > 0")
                ->orWhereRaw("POSITION(products.article IN '$string') > 0")
                ->orWhereRaw("POSITION(categories.name IN '$string') > 0");
        });
    }

    private function queryByFiltersAndSort($products,$data) {
        
        if(isset($data['category_slug'])) {
            $products = $products
            ->where('categories.slug', $data['category_slug']);
        }
        if($data['sort_new']) {
            $products = $products->orderBy('new','desc');
        }
        if($data['sort_price'] !== 0) {
            $products = $products->orderBy('products.price_discount',$data['sort_price']===1?'asc':'desc');
        }
        
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
