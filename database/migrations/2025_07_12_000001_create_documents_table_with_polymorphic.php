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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            // Legacy fields (nullable for backward compatibility)
            $table->enum('category', ['buyer', 'seller', 'land'])->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            
            // Polymorphic relationship fields
            $table->string('documentable_type')->nullable();
            $table->unsignedBigInteger('documentable_id')->nullable();
            
            // Document metadata
            $table->string('file_name');
            $table->string('file_path');
            $table->unsignedInteger('file_size'); // in bytes
            $table->string('mime_type');
            $table->boolean('is_display')->default(false); // true if selected for display
            $table->timestamps();
            
            // Add indexes for faster lookups
            $table->index(['category', 'reference_id']);
            $table->index(['documentable_type', 'documentable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
