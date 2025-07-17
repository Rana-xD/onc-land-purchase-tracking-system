<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, drop the foreign key constraint
        Schema::table('payment_documents', function (Blueprint $table) {
            $table->dropForeign(['payment_step_id']);
        });

        // Drop the document_type column as it's no longer needed
        Schema::table('payment_documents', function (Blueprint $table) {
            $table->dropColumn('document_type');
        });
        
        // Rename the table to contract_documents to better reflect its purpose
        Schema::rename('payment_documents', 'contract_documents');
        
        // Add sale_contract_id column and remove payment_step_id
        Schema::table('contract_documents', function (Blueprint $table) {
            $table->dropColumn('payment_step_id');
            $table->foreignId('sale_contract_id')->after('id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rename the table back to payment_documents
        Schema::rename('contract_documents', 'payment_documents');
        
        // Add back payment_step_id and remove sale_contract_id
        Schema::table('payment_documents', function (Blueprint $table) {
            $table->dropForeign(['sale_contract_id']);
            $table->dropColumn('sale_contract_id');
            $table->foreignId('payment_step_id')->after('id')->constrained()->onDelete('cascade');
        });
        
        // Add back the document_type column
        Schema::table('payment_documents', function (Blueprint $table) {
            $table->enum('document_type', [
                'payment_contract', 
                'payment_evidence'
            ])->default('payment_evidence')->after('payment_step_id');
        });
    }
};
