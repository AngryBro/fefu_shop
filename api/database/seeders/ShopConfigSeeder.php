<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShopConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            'pickup_point' => [
                'adress' => 'г. Владивосток, о.Русский, ДВФУ, ауд. D644',
                'time' => '24/7'
            ],
            'email' => [
                'angry.bro.v.2013@gmail.com'
            ],
            'slide' => [
                ['image' => 'testimg', 'link' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'blank' => true],
                ['image' => 'testimg', 'link' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'blank' => true],
                ['image' => 'testimg', 'link' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'blank' => true]
            ]
        ];
        foreach($data as $key => $value) {
            $shopConfig = new \App\Models\ShopConfig;
            $shopConfig->name = $key;
            $shopConfig->value = json_encode($value);
            $shopConfig->save();
        }
    }
}
