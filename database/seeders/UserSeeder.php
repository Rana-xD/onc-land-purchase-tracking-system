<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles from the database first
        $adminRole = Role::where('name', 'admin')->first();
        $managerRole = Role::where('name', 'manager')->first();
        $staffRole = Role::where('name', 'staff')->first();
        
        // Always ensure administrator role has ALL permissions (override DefaultRoleSeeder restrictions)
        if ($adminRole) {
            $allPermissions = Permission::all();
            $adminRole->permissions()->sync($allPermissions->pluck('id')->toArray());
            $this->command->info('Administrator role updated with all ' . $allPermissions->count() . ' permissions.');
        } else {
            $this->command->error('Administrator role not found! Make sure DefaultRoleSeeder runs first.');
        }
        
        // Only create users if none exist
        if (User::count() > 0) {
            $this->command->info('Users already exist. Administrator permissions have been updated.');
            return;
        }


        // អេតមីន (Admin) users
        User::create([
            'name' => 'សុខ វិចិត្រ',  // Sok Vichet
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role_id' => $adminRole?->id,
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឈឿន សុវណ្ណារិទ្ធ',  // Chhoeun Sovannarithy
            'username' => 'sovannarithy',
            'password' => Hash::make('password'),
            'role_id' => $adminRole?->id,
            'is_active' => true,
        ]);

        // Manager users
        User::create([
            'name' => 'ចាន់ សុភា',  // Chan Sopha
            'username' => 'sopha',
            'password' => Hash::make('password'),
            'role_id' => $managerRole?->id,
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឃុន ចាន់ថា',  // Khun Chantha
            'username' => 'chantha',
            'password' => Hash::make('password'),
            'role_id' => $managerRole?->id,
            'is_active' => true,
        ]);

        // Staff users
        User::create([
            'name' => 'ម៉ៅ សុខា',  // Mao Sokha
            'username' => 'sokha',
            'password' => Hash::make('password'),
            'role_id' => $staffRole?->id,
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឃឹម សុគន្ធា',  // Khim Sokantha
            'username' => 'sokantha',
            'password' => Hash::make('password'),
            'role_id' => $staffRole?->id,
            'is_active' => true,
        ]);
        
        User::create([
            'name' => 'ឃាង សុវណ្ណដា',  // Kheang Sovannda
            'username' => 'sovannda',
            'password' => Hash::make('password'),
            'role_id' => $staffRole?->id,
            'is_active' => true,
        ]);
        
        $this->command->info('Users seeded successfully!');
        $this->command->info('Administrator users: admin, sovannarithy');
        $this->command->info('Manager users: sopha, chantha');
        $this->command->info('Staff users: sokha, sokantha, sovannda');
    }
}
