<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // First, create permissions and roles
            PermissionSeeder::class,
            DefaultRoleSeeder::class,
            
            // Then create users (which depend on roles)
            UserSeeder::class,
            
            // Finally, create other data
            SellerSeeder::class,
            BuyerSeeder::class,
            LandSeeder::class,
        ]);
    }
}
