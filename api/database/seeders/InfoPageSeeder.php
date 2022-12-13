<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InfoPage;

class InfoPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // InfoPage::factory()->count(5)->create();
        $page = new InfoPage;
        $page->header = 'О нас';
        $page->slug = 'about';
        $page->text1 = 'текст1';
        $page->text2 = 'текст2';
        $page->hidden = false;
        $page->place = 13;
        $page->save();
        $page = new InfoPage;
        $page->header = 'Политика конфиденциальности';
        $page->slug = 'confidentials';
        $page->text1 = 'текст1';
        $page->text2 = 'текст2';
        $page->hidden = false;
        $page->place = 2;
        $page->save();
        $page = new InfoPage;
        $page->header = 'Пользовательское соглашение';
        $page->slug = 'agreement';
        $page->text1 = 'текст1';
        $page->text2 = 'текст2';
        $page->hidden = false;
        $page->place = 2;
        $page->save();
        $page = new InfoPage;
        $page->header = 'Контакты';
        $page->slug = 'contacts';
        $page->text1 = 'текст1';
        $page->text2 = 'текст2';
        $page->hidden = false;
        $page->place = 13;
        $page->save();
        $page = new InfoPage;
        $page->header = 'Доставка';
        $page->slug = 'delivery';
        $page->text1 = 'текст1';
        $page->text2 = 'текст2';
        $page->hidden = false;
        $page->place = 13;
        $page->save();
        $page = new InfoPage;
        $page->header = 'Оплата';
        $page->slug = 'payment';
        $page->text1 = 'текст1';
        $page->text2 = 'текст2';
        $page->hidden = false;
        $page->place = 3;
        $page->save();
    }
}
