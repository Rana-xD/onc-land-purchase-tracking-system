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
            $table->enum('category', ['buyer', 'seller', 'land']);
            $table->unsignedBigInteger('reference_id'); // links to buyer_id, seller_id, or land_id
            $table->string('file_name');
            $table->string('file_path');
            $table->unsignedInteger('file_size'); // in bytes
            $table->string('mime_type');
            $table->boolean('is_display')->default(false); // true if selected for display
            $table->timestamps();
            
            // Add index for faster lookups
            $table->index(['category', 'reference_id']);
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
