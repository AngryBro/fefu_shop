<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach([Role::USER,Role::ADMIN] as $roleName) {
            $role = new Role;
            $role->name = $roleName;
            $role->save();
        }
    }
}