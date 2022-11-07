<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FavouriteProduct;

class FavouriteProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for($i = 1; $i <= 5; $i ++) {
            $favouriteProduct = new FavouriteProduct;
            $favouriteProduct->product_id = $i;
            $favouriteProduct->favourite_id = 1;
            $favouriteProduct->save();
        }
    }
}
