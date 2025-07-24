<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Dashboard Module
            [
                'name' => 'dashboard.view',
                'display_name' => 'មើលផ្ទាំងគ្រប់គ្រង',
                'description' => 'ចូលប្រើផ្ទាំងគ្រប់គ្រង និងស្ថិតិ',
                'module' => 'dashboard',
                'action' => 'view'
            ],

            // Data Entry - Buyers Module
            [
                'name' => 'buyers.view',
                'display_name' => 'មើលអ្នកទិញ',
                'description' => 'មើលព័ត៌មាន និងបញ្ជីអ្នកទិញ',
                'module' => 'buyers',
                'action' => 'view'
            ],
            [
                'name' => 'buyers.create',
                'display_name' => 'បង្កើតអ្នកទិញ',
                'description' => 'បន្ថែមកំណត់ត្រាអ្នកទិញថ្មី',
                'module' => 'buyers',
                'action' => 'create'
            ],
            [
                'name' => 'buyers.edit',
                'display_name' => 'កែប្រែអ្នកទិញ',
                'description' => 'កែប្រែព័ត៌មានអ្នកទិញដែលមានស្រាប់',
                'module' => 'buyers',
                'action' => 'edit'
            ],
            [
                'name' => 'buyers.delete',
                'display_name' => 'លុបអ្នកទិញ',
                'description' => 'លុបកំណត់ត្រាអ្នកទិញ',
                'module' => 'buyers',
                'action' => 'delete'
            ],

            // Data Entry - Sellers Module
            [
                'name' => 'sellers.view',
                'display_name' => 'មើលអ្នកលក់',
                'description' => 'មើលព័ត៌មាន និងបញ្ជីអ្នកលក់',
                'module' => 'sellers',
                'action' => 'view'
            ],
            [
                'name' => 'sellers.create',
                'display_name' => 'បង្កើតអ្នកលក់',
                'description' => 'បន្ថែមកំណត់ត្រាអ្នកលក់ថ្មី',
                'module' => 'sellers',
                'action' => 'create'
            ],
            [
                'name' => 'sellers.edit',
                'display_name' => 'កែប្រែអ្នកលក់',
                'description' => 'កែប្រែព័ត៌មានអ្នកលក់ដែលមានស្រាប់',
                'module' => 'sellers',
                'action' => 'edit'
            ],
            [
                'name' => 'sellers.delete',
                'display_name' => 'លុបអ្នកលក់',
                'description' => 'លុបកំណត់ត្រាអ្នកលក់',
                'module' => 'sellers',
                'action' => 'delete'
            ],

            // Data Entry - Lands Module
            [
                'name' => 'lands.view',
                'display_name' => 'មើលដី',
                'description' => 'មើលព័ត៌មាន និងបញ្ជីដី',
                'module' => 'lands',
                'action' => 'view'
            ],
            [
                'name' => 'lands.create',
                'display_name' => 'បង្កើតដី',
                'description' => 'បន្ថែមកំណត់ត្រាដីថ្មី',
                'module' => 'lands',
                'action' => 'create'
            ],
            [
                'name' => 'lands.edit',
                'display_name' => 'កែប្រែដី',
                'description' => 'កែប្រែព័ត៌មានដីដែលមានស្រាប់',
                'module' => 'lands',
                'action' => 'edit'
            ],
            [
                'name' => 'lands.delete',
                'display_name' => 'លុបដី',
                'description' => 'លុបកំណត់ត្រាដី',
                'module' => 'lands',
                'action' => 'delete'
            ],

            // Document Creation - Deposit Contracts
            [
                'name' => 'deposit_contracts.view',
                'display_name' => 'មើលលិខិតកក់ប្រាក់',
                'description' => 'មើលបញ្ជី និងព័ត៌មានលម្អិតលិខិតកក់ប្រាក់',
                'module' => 'deposit_contracts',
                'action' => 'view'
            ],
            [
                'name' => 'deposit_contracts.create',
                'display_name' => 'បង្កើតលិខិតកក់ប្រាក់',
                'description' => 'បង្កើតលិខិតកក់ប្រាក់ថ្មី',
                'module' => 'deposit_contracts',
                'action' => 'create'
            ],
            [
                'name' => 'deposit_contracts.edit',
                'display_name' => 'កែប្រែលិខិតកក់ប្រាក់',
                'description' => 'កែប្រែលិខិតកក់ប្រាក់ដែលមានស្រាប់',
                'module' => 'deposit_contracts',
                'action' => 'edit'
            ],
            [
                'name' => 'deposit_contracts.delete',
                'display_name' => 'លុបលិខិតកក់ប្រាក់',
                'description' => 'លុបលិខិតកក់ប្រាក់',
                'module' => 'deposit_contracts',
                'action' => 'delete'
            ],
            [
                'name' => 'deposit_contracts.download',
                'display_name' => 'ដាអ៊នឡោដលិខិតកក់ប្រាក់',
                'description' => 'ដាអ៊នឡោដឯកសារលិខិតកក់ប្រាក់',
                'module' => 'deposit_contracts',
                'action' => 'download'
            ],

            // Document Creation - Sale Contracts
            [
                'name' => 'sale_contracts.view',
                'display_name' => 'មើលលិខិតទិញលក់',
                'description' => 'មើលបញ្ជី និងព័ត៌មានលម្អិតលិខិតទិញលក់',
                'module' => 'sale_contracts',
                'action' => 'view'
            ],
            [
                'name' => 'sale_contracts.create',
                'display_name' => 'បង្កើតលិខិតទិញលក់',
                'description' => 'បង្កើតលិខិតទិញលក់ថ្មី',
                'module' => 'sale_contracts',
                'action' => 'create'
            ],
            [
                'name' => 'sale_contracts.edit',
                'display_name' => 'កែប្រែលិខិតទិញលក់',
                'description' => 'កែប្រែលិខិតទិញលក់ដែលមានស្រាប់',
                'module' => 'sale_contracts',
                'action' => 'edit'
            ],
            [
                'name' => 'sale_contracts.delete',
                'display_name' => 'លុបលិខិតទិញលក់',
                'description' => 'លុបលិខិតទិញលក់',
                'module' => 'sale_contracts',
                'action' => 'delete'
            ],
            [
                'name' => 'sale_contracts.download',
                'display_name' => 'ដាអ៊នឡោដលិខិតទិញលក់',
                'description' => 'ដាអ៊នឡោដឯកសារលិខិតទិញលក់',
                'module' => 'sale_contracts',
                'action' => 'download'
            ],
            [
                'name' => 'sale_contracts.mark_paid',
                'display_name' => 'ដាក់សម្គាល់ប្រាក់លិខិតទិញលក់',
                'description' => 'ដាក់សម្គាល់ការប្រាក់ក្នុងលិខិតទិញលក់',
                'module' => 'sale_contracts',
                'action' => 'mark_paid'
            ],

            // Reports Module
            [
                'name' => 'reports.view',
                'display_name' => 'មើលរបាយការណ៍',
                'description' => 'ចូលប្រើផន្ទែករបាយការណ៍',
                'module' => 'reports',
                'action' => 'view'
            ],
            [
                'name' => 'reports.document',
                'display_name' => 'របាយការណ៍ឯកសារ',
                'description' => 'មើល និងនាំចេញរបាយការណ៍ឯកសារ',
                'module' => 'reports',
                'action' => 'document'
            ],
            [
                'name' => 'reports.monthly',
                'display_name' => 'របាយការណ៍ប្រចាំខែ',
                'description' => 'មើល និងនាំចេញរបាយការណ៍ប្រចាំខែ',
                'module' => 'reports',
                'action' => 'monthly'
            ],
            [
                'name' => 'reports.yearly',
                'display_name' => 'របាយការណ៍ប្រចាំឆ្នាំ',
                'description' => 'មើល និងនាំចេញរបាយការណ៍ប្រចាំឆ្នាំ',
                'module' => 'reports',
                'action' => 'yearly'
            ],
            [
                'name' => 'reports.payment_status',
                'display_name' => 'របាយការណ៍ស្ថានភាពការប្រាក់',
                'description' => 'មើល និងនាំចេញរបាយការណ៍ស្ថានភាពការប្រាក់',
                'module' => 'reports',
                'action' => 'payment_status'
            ],
            [
                'name' => 'reports.export',
                'display_name' => 'នាំចេញរបាយការណ៍',
                'description' => 'នាំចេញរបាយការណ៍ទៅក្រមោដែលព័វព្រៀង',
                'module' => 'reports',
                'action' => 'export'
            ],

            // Commission Management - Pre-Purchase
            [
                'name' => 'pre_purchase_commission.view',
                'display_name' => 'មើលកម៉ីសិនមុនទិញ',
                'description' => 'មើលកំណត់ត្រាកម៉ីសិនមុនទិញ',
                'module' => 'pre_purchase_commission',
                'action' => 'view'
            ],
            [
                'name' => 'pre_purchase_commission.create',
                'display_name' => 'បង្កើតកម៉ីសិនមុនទិញ',
                'description' => 'បង្កើតកំណត់ត្រាកម៉ីសិនមុនទិញថ្មី',
                'module' => 'pre_purchase_commission',
                'action' => 'create'
            ],
            [
                'name' => 'pre_purchase_commission.edit',
                'display_name' => 'កែប្រែកម៉ីសិនមុនទិញ',
                'description' => 'កែប្រែកំណត់ត្រាកម៉ីសិនមុនទិញ',
                'module' => 'pre_purchase_commission',
                'action' => 'edit'
            ],
            [
                'name' => 'pre_purchase_commission.delete',
                'display_name' => 'លុបកម៉ីសិនមុនទិញ',
                'description' => 'លុបកំណត់ត្រាកម៉ីសិនមុនទិញ',
                'module' => 'pre_purchase_commission',
                'action' => 'delete'
            ],
            [
                'name' => 'pre_purchase_commission.mark_paid',
                'display_name' => 'ដាក់សម្គាល់កម៉ីសិនមុនទិញបានបង់',
                'description' => 'ដាក់សម្គាល់កម៉ីសិនមុនទិញជាបានបង់',
                'module' => 'pre_purchase_commission',
                'action' => 'mark_paid'
            ],

            // Commission Management - Post-Purchase
            [
                'name' => 'post_purchase_commission.view',
                'display_name' => 'មើលកម៉ីសិនក្រោយទិញ',
                'description' => 'មើលកំណត់ត្រាកម៉ីសិនក្រោយទិញ',
                'module' => 'post_purchase_commission',
                'action' => 'view'
            ],
            [
                'name' => 'post_purchase_commission.create',
                'display_name' => 'បង្កើតកម៉ីសិនក្រោយទិញ',
                'description' => 'បង្កើតកំណត់ត្រាកម៉ីសិនក្រោយទិញថ្មី',
                'module' => 'post_purchase_commission',
                'action' => 'create'
            ],
            [
                'name' => 'post_purchase_commission.edit',
                'display_name' => 'កែប្រែកម៉ីសិនក្រោយទិញ',
                'description' => 'កែប្រែកំណត់ត្រាកម៉ីសិនក្រោយទិញ',
                'module' => 'post_purchase_commission',
                'action' => 'edit'
            ],
            [
                'name' => 'post_purchase_commission.delete',
                'display_name' => 'លុបកម៉ីសិនក្រោយទិញ',
                'description' => 'លុបកំណត់ត្រាកម៉ីសិនក្រោយទិញ',
                'module' => 'post_purchase_commission',
                'action' => 'delete'
            ],
            [
                'name' => 'post_purchase_commission.mark_paid',
                'display_name' => 'ដាក់សម្គាល់កម៉ីសិនក្រោយទិញបានបង់',
                'description' => 'ដាក់សម្គាល់ការបង់ប្រាក់កម៉ីសិនក្រោយទិញជាបានបង់',
                'module' => 'post_purchase_commission',
                'action' => 'mark_paid'
            ],

            // User Management
            [
                'name' => 'users.view',
                'display_name' => 'មើលអ្នកប្រើប្រាស់',
                'description' => 'មើលបញ្ជី និងព័ត៌មានលម្អិតអ្នកប្រើប្រាស់',
                'module' => 'users',
                'action' => 'view'
            ],
            [
                'name' => 'users.create',
                'display_name' => 'បង្កើតអ្នកប្រើប្រាស់',
                'description' => 'បង្កើតគណនីអ្នកប្រើប្រាស់ថ្មី',
                'module' => 'users',
                'action' => 'create'
            ],
            [
                'name' => 'users.edit',
                'display_name' => 'កែប្រែអ្នកប្រើប្រាស់',
                'description' => 'កែប្រែគណនីអ្នកប្រើប្រាស់ដែលមានស្រាប់',
                'module' => 'users',
                'action' => 'edit'
            ],
            [
                'name' => 'users.delete',
                'display_name' => 'លុបអ្នកប្រើប្រាស់',
                'description' => 'លុបគណនីអ្នកប្រើប្រាស់',
                'module' => 'users',
                'action' => 'delete'
            ],
            [
                'name' => 'users.toggle_status',
                'display_name' => 'ប្ដូរស្ថានភាពអ្នកប្រើប្រាស់',
                'description' => 'បើក ឬបិទគណនីអ្នកប្រើប្រាស់',
                'module' => 'users',
                'action' => 'toggle_status'
            ],

            // Role and Permission Management
            [
                'name' => 'roles.view',
                'display_name' => 'មើលតួនាទី',
                'description' => 'មើលបញ្ជី និងព័ត៌មានលម្អិតតួនាទី',
                'module' => 'roles',
                'action' => 'view'
            ],
            [
                'name' => 'roles.create',
                'display_name' => 'បង្កើតតួនាទី',
                'description' => 'បង្កើតតួនាទីថ្មី',
                'module' => 'roles',
                'action' => 'create'
            ],
            [
                'name' => 'roles.edit',
                'display_name' => 'កែប្រែតួនាទី',
                'description' => 'កែប្រែតួនាទីដែលមានស្រាប់',
                'module' => 'roles',
                'action' => 'edit'
            ],
            [
                'name' => 'roles.delete',
                'display_name' => 'លុបតួនាទី',
                'description' => 'លុបតួនាទី',
                'module' => 'roles',
                'action' => 'delete'
            ],
            [
                'name' => 'permissions.manage',
                'display_name' => 'គ្រប់គ្រងសិទ្ធិ',
                'description' => 'កំណត់ និងបោះបង់សិទ្ធិទៅ/ពីតួនាទី',
                'module' => 'permissions',
                'action' => 'manage'
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }

        $this->command->info('Permissions seeded successfully!');
    }
}
