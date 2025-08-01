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
        Schema::table('document_creations', function (Blueprint $table) {
            $table->string('document_code')->nullable()->after('id');
            $table->index('document_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_creations', function (Blueprint $table) {
            $table->dropColumn('document_code');
        });
    }
};
