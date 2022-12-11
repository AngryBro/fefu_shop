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
            'pickup_payment' => [
                'text' => 'Здесь будет информация об оплате при самовывозе',
                'link' => 'ссылка на инфостраницу об оплате'
            ],
            'delivery_payment' => [
                'text' => 'Здесь будет инфа об оплате при доставке',
                'link' => 'ссылка на страницу об оплате при доставке'
            ],
            'email' => [
                'angry.bro.v.2013@gmail.com'
            ],
            'footer_categories' => [1,2,3],
            'slide' => [
                'left' => '/api/img/slide/left.png',
                'right' => '/api/img/slide/right.png',
                'logo' => '/api/img/slide/logo.png'
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
