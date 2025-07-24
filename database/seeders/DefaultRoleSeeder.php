<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DefaultRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default roles with Khmer names
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'អេតមីន',
                'description' => 'អ្នកគ្រប់គ្រងប្រព័ន្ធដែលមានសិទ្ធិពេញលេញ',
                'is_active' => true
            ],
            [
                'name' => 'manager',
                'display_name' => 'អ្នកគ្រប់គ្រង',
                'description' => 'អ្នកគ្រប់គ្រងដែលមានសិទ្ធិមួយចំនួន',
                'is_active' => true
            ],
            [
                'name' => 'staff',
                'display_name' => 'បុគ្គលិក',
                'description' => 'បុគ្គលិកដែលមានសិទ្ធិមូលដ្ឋាន',
                'is_active' => true
            ]
        ];

        foreach ($roles as $roleData) {
            $role = Role::updateOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );

            // Assign permissions based on role
            $this->assignPermissionsToRole($role);
        }

        $this->command->info('Default roles created successfully!');
    }

    private function assignPermissionsToRole(Role $role)
    {
        $allPermissions = Permission::all();
        
        switch ($role->name) {
            case 'admin':
                // អេតមីន gets all permissions
                $role->permissions()->sync($allPermissions->pluck('id'));
                break;
                
            case 'manager':
                // អ្នកគ្រប់គ្រង gets most permissions except user/role management
                $managerPermissions = $allPermissions->filter(function ($permission) {
                    return !in_array($permission->module, ['users', 'roles', 'permissions']);
                });
                $role->permissions()->sync($managerPermissions->pluck('id'));
                break;
                
            case 'staff':
                // បុគ្គលិក gets basic operational permissions
                $staffPermissions = $allPermissions->filter(function ($permission) {
                    return in_array($permission->action, ['view', 'create', 'edit']) &&
                           in_array($permission->module, [
                               'dashboard', 'buyers', 'sellers', 'lands',
                               'deposit_contracts', 'sale_contracts'
                           ]);
                });
                $role->permissions()->sync($staffPermissions->pluck('id'));
                break;
        }
    }
}
