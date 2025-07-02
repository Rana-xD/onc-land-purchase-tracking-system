<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Database\Seeder;

class UserActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        $actions = [
            'ចូលប្រព័ន្ធ', // Login
            'ចាកចេញពីប្រព័ន្ធ', // Logout
            'មើលទិន្នន័យ', // View data
            'បង្កើតទិន្នន័យថ្មី', // Create new data
            'កែប្រែទិន្នន័យ', // Edit data
            'លុបទិន្នន័យ', // Delete data
        ];
        
        $descriptions = [
            'ចូលប្រព័ន្ធដោយជោគជ័យ', // Login successful
            'ចាកចេញពីប្រព័ន្ធដោយជោគជ័យ', // Logout successful
            'មើលទិន្នន័យដី', // View land data
            'បង្កើតកំណត់ត្រាដីថ្មី', // Create new land record
            'កែប្រែព័ត៌មានដី', // Edit land information
            'លុបកំណត់ត្រាដី', // Delete land record
        ];
        
        foreach ($users as $user) {
            // Create 5 activities for each user
            for ($i = 0; $i < 5; $i++) {
                $actionIndex = array_rand($actions);
                $descriptionIndex = array_rand($descriptions);
                
                UserActivity::create([
                    'user_id' => $user->id,
                    'action' => $actions[$actionIndex],
                    'description' => $descriptions[$descriptionIndex],
                    'ip_address' => '127.0.0.1',
                ]);
            }
        }
    }
}
