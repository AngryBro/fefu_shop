<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $this->call([
            SizeSeeder::class,
            ColorSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            MaterialSeeder::class,
            ProductSeeder::class,
            RoleSeeder::class,
            // FavouriteProductSeeder::class,
            // FavouriteSeeder::class
            // SessionSeeder::class
        ]);
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}