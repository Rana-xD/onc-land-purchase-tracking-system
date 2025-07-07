<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only seed if no users exist or if specifically requested
        if (User::count() > 0) {
            return;
        }
        
        // អេតមីន (Administrator) users
        User::create([
            'name' => 'សុខ វិចិត្រ',  // Sok Vichet
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឈឿន សុវណ្ណារិទ្ធ',  // Chhoeun Sovannarithy
            'username' => 'sovannarithy',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'is_active' => true,
        ]);

        // Manager users
        User::create([
            'name' => 'ចាន់ សុភា',  // Chan Sopha
            'username' => 'sopha',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឃុន ចាន់ថា',  // Khun Chantha
            'username' => 'chantha',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឡុង សុភ័ក្រ',  // Long Sopheak
            'username' => 'sopheak',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'is_active' => false,  // Inactive user
        ]);

        // Staff users
        User::create([
            'name' => 'ម៉ៅ សុខា',  // Mao Sokha
            'username' => 'sokha',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឃឹម សុគន្ធា',  // Khim Sokantha
            'username' => 'sokantha',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឈិន សុផល',  // Chhin Sophal
            'username' => 'sophal',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឃុត សុភារី',  // Khut Sopheary
            'username' => 'sopheary',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឈុន សុខលី',  // Chhun Sokly
            'username' => 'sokly',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => false,  // Inactive user
        ]);
        
        User::create([
            'name' => 'ឡុង សុវណ្ណា',  // Long Sovanna
            'username' => 'sovanna',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឃាង សុវណ្ណដា',  // Kheang Sovannda
            'username' => 'sovannda',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
        ]);
    }
}
