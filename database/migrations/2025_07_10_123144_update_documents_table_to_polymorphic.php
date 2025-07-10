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
        Schema::table('documents', function (Blueprint $table) {
            // Add polymorphic relationship columns
            $table->string('documentable_type')->nullable()->after('reference_id');
            $table->unsignedBigInteger('documentable_id')->nullable()->after('documentable_type');
            
            // Add index for polymorphic relationship
            $table->index(['documentable_type', 'documentable_id']);
            
            // Update existing records to use the new polymorphic columns
            // This will be handled in a separate data migration if needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            // Remove polymorphic columns
            $table->dropIndex(['documentable_type', 'documentable_id']);
            $table->dropColumn('documentable_type');
            $table->dropColumn('documentable_id');
        });
    }
};
