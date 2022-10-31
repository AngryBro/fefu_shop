<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Color;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $colors = [
            'white' => ['255,255,255','W'],
            'black' => ['0,0,0','B'],
            'blue' => ['0,162,255','BL']
        ];
        foreach($colors as $color => $rgb) {
            $model = new Color;
            $model->name = $color;
            $model->rgb = $rgb[0];
            $model->article = $rgb[1];
            $model->save();
        }
    }
}
