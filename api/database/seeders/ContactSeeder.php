<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Contact;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['phone_number' ,'Номер телефона' , '88005553535'],
            ['whatsapp', 'Номер WA' , '89005553535'],
            ['email', 'Почтовый ящик' , 'mail@logo.org'],
            ['telegram', 'Телеграм' , 'logo@t.me'],
            ['youtube', 'YouTube' , 'LogoShop'],
            ['vk', 'Вконтакте' , 'vk.com/logo'],
            ['instagram', 'Instagram (запрещённая соц. сеть в РФ)' , '@logo'],
            ['avito', 'Avito' , 'avito/logo'],
            ['adress', 'Адрес' , 'Приморский край, о. Русский, п. Аякс 10, ауд. D644'],
            ['time', 'Время работы' , '24/7'],
            ['map', 'Координаты для карты' , 'хз как вбить пока']
        ];
        foreach($data as $key => $value) {
            $contact = new Contact;
            $contact->name_internal = $value[0];
            $contact->name = $value[1];
            $contact->value = $value[2];
            $contact->save();
        }
    }
}
