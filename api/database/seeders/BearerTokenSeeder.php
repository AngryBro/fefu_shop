<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BearerToken;

class BearerTokenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $token = new BearerToken;
        $token->user_id = 1;
        $token->token = 'admintoken';
        $token->save();
        $token = new BearerToken;
        $token->user_id = 2;
        $token->token = 'usertoken';
        $token->save();
    }
}
