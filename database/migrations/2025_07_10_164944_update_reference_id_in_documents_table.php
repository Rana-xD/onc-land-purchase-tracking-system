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
            // Make reference_id nullable since we're using polymorphic relationship now
            $table->unsignedBigInteger('reference_id')->nullable()->change();
            $table->string('category')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            // Revert reference_id and category back to non-nullable
            $table->unsignedBigInteger('reference_id')->nullable(false)->change();
            $table->string('category')->nullable(false)->change();
        });
    }
};
