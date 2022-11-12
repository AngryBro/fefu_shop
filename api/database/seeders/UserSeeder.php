<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new User;
        $user->name = 'admin';
        $user->phone_number = '70000000001';
        $user->email = 'admin@admin.ru';
        $user->role_id = 2;
        $user->save();
        $user = new User;
        $user->name = 'user';
        $user->phone_number = '70000000002';
        $user->email = 'user@user.ru';
        $user->role_id = 1;
        $user->save();
    }
}
