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
            'Номер телефона' => '88005553535',
            'Номер WA' => '89005553535',
            'Почтовый ящик' => 'mail@logo.org',
            'Телеграм' => 'logo@t.me',
            'YouTube' => 'LogoShop',
            'Вконтакте' => 'vk.com/logo',
            'Instagram (запрещённая соц. сеть в РФ)' => '@logo',
            'Avito' => 'avito/logo',
            'Адрес' => 'Приморский край, о. Русский, п. Аякс 10, ауд. D644',
            'Время работы' => '24/7',
            'Координаты для карты' => 'хз как вбить пока'
        ];
        foreach($data as $key => $value) {
            $contact = new Contact;
            $contact->name = $key;
            $contact->value = $value;
            $contact->save();
        }
    }
}
