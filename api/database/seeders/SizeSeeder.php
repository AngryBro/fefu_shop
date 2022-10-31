<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Size;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach(['XS','S','M','L','XL'] as $sizeName) {
            $size = new Size;
            $size->name = $sizeName;
            $size->description = "описание размера $sizeName";
            $size->save();
        }
    }
}
