<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProductImage;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for($i = 1; $i <= 50; $i++) {
            for($j = 0; $j < 3; $j++) {
                $img = new ProductImage;
                $img->product_id = $i;
                $img->image = 'testimg';
                $img->save();
            }
        }
    }
}
