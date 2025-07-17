<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Modify the column to allow both old and new enum values
        DB::statement("ALTER TABLE payment_steps MODIFY COLUMN status ENUM('pending', 'contract_created', 'paid', 'overdue', 'unpaid') NOT NULL DEFAULT 'pending'");
        
        // Step 2: Update the data - convert old statuses to new ones
        DB::statement("UPDATE payment_steps SET status = 'unpaid' WHERE status IN ('pending', 'contract_created', 'overdue')");
        
        // Step 3: Restrict the enum to only the new values
        DB::statement("ALTER TABLE payment_steps MODIFY COLUMN status ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to the original enum values
        DB::statement("ALTER TABLE payment_steps MODIFY COLUMN status ENUM('pending', 'contract_created', 'paid', 'overdue') NOT NULL DEFAULT 'pending'");
    }
};
