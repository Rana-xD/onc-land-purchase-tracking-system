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
        // For MySQL, we need to alter the ENUM column to add the new value
        DB::statement("ALTER TABLE document_creations MODIFY COLUMN document_type ENUM('deposit_contract', 'sale_contract', 'acceptance_contract')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Check if there are any acceptance_contract records before removing the enum value
        $acceptanceContractCount = DB::table('document_creations')
            ->where('document_type', 'acceptance_contract')
            ->count();

        if ($acceptanceContractCount > 0) {
            throw new Exception('Cannot remove acceptance_contract from enum - there are still records with this type');
        }

        // Remove the acceptance_contract option from the enum
        DB::statement("ALTER TABLE document_creations MODIFY COLUMN document_type ENUM('deposit_contract', 'sale_contract')");
    }
};
