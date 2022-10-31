<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach(['gucci','evernit','dior'] as $brand) {
            $brandModel = new Brand;
            $brandModel->name = $brand;
            $brandModel->save();
        }
    }
}
