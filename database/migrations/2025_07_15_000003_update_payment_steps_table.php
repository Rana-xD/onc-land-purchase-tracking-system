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
        Schema::table('payment_steps', function (Blueprint $table) {
            // Add new columns for payment contract tracking
            $table->boolean('payment_contract_created')->default(false)->after('due_date');
            $table->timestamp('payment_contract_created_at')->nullable()->after('payment_contract_created');
            $table->foreignId('payment_contract_created_by')->nullable()->after('payment_contract_created_at');
            $table->enum('status', ['pending', 'contract_created', 'paid', 'overdue'])->default('pending')->after('payment_contract_created_by');
            
            // Add foreign key constraint
            $table->foreign('payment_contract_created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_steps', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['payment_contract_created_by']);
            
            // Drop columns
            $table->dropColumn([
                'payment_contract_created',
                'payment_contract_created_at',
                'payment_contract_created_by',
                'status'
            ]);
        });
    }
};
