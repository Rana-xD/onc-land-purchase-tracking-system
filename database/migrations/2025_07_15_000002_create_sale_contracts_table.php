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
        Schema::create('sale_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_id', 50)->unique()->comment('Searchable contract ID');
            $table->foreignId('document_creation_id')->constrained()->onDelete('cascade');
            $table->foreignId('land_id')->nullable()->constrained();
            $table->string('buyer_name', 255);
            $table->string('buyer_phone', 20)->nullable();
            $table->text('buyer_address')->nullable();
            $table->string('seller_name', 255);
            $table->string('seller_phone', 20)->nullable();
            $table->text('seller_address')->nullable();
            $table->decimal('total_amount', 15, 2);
            $table->date('contract_date');
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_contracts');
    }
};
