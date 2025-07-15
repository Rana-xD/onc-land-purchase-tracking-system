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
            UserSeeder::class,
            SellerSeeder::class,
            BuyerSeeder::class,
            LandSeeder::class,
            // Removed buyer, seller, and land seeders for development simplicity
        ]);
    }
}
