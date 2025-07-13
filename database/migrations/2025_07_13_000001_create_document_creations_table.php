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
        Schema::create('document_creations', function (Blueprint $table) {
            $table->id();
            $table->enum('document_type', ['deposit_contract', 'sale_contract']);
            $table->foreignId('created_by')->constrained('users');
            $table->enum('status', ['draft', 'completed', 'cancelled'])->default('draft');
            $table->decimal('total_land_price', 15, 2)->nullable();
            $table->decimal('deposit_amount', 15, 2)->nullable();
            $table->unsignedTinyInteger('deposit_months')->nullable();
            $table->timestamps();
        });

        Schema::create('document_buyers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_creation_id')->constrained()->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained();
            $table->timestamps();
        });

        Schema::create('document_sellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_creation_id')->constrained()->onDelete('cascade');
            $table->foreignId('seller_id')->constrained();
            $table->timestamps();
        });

        Schema::create('document_lands', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_creation_id')->constrained()->onDelete('cascade');
            $table->foreignId('land_id')->constrained();
            $table->decimal('price_per_m2', 15, 2)->nullable();
            $table->decimal('total_price', 15, 2);
            $table->timestamps();
        });

        Schema::create('payment_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_creation_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('step_number');
            $table->string('payment_time_description');
            $table->decimal('amount', 15, 2);
            $table->date('due_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_steps');
        Schema::dropIfExists('document_lands');
        Schema::dropIfExists('document_sellers');
        Schema::dropIfExists('document_buyers');
        Schema::dropIfExists('document_creations');
    }
};
