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
        // Add soft deletes to buyers table
        Schema::table('buyers', function (Blueprint $table) {
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });

        // Add soft deletes to sellers table
        Schema::table('sellers', function (Blueprint $table) {
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });

        // Add soft deletes to lands table
        Schema::table('lands', function (Blueprint $table) {
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });

        // Add soft deletes to commissions table
        Schema::table('commissions', function (Blueprint $table) {
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });

        // Add soft deletes to document_creations table
        Schema::table('document_creations', function (Blueprint $table) {
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });

        // Add soft deletes to sale_contracts table
        Schema::table('sale_contracts', function (Blueprint $table) {
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });

        // Add deleted_by to users table (already has soft deletes)
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });

        // Add deleted_by to roles table (already has soft deletes)
        Schema::table('roles', function (Blueprint $table) {
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove soft deletes from buyers table
        Schema::table('buyers', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
            $table->dropSoftDeletes();
        });

        // Remove soft deletes from sellers table
        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
            $table->dropSoftDeletes();
        });

        // Remove soft deletes from lands table
        Schema::table('lands', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
            $table->dropSoftDeletes();
        });

        // Remove soft deletes from commissions table
        Schema::table('commissions', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
            $table->dropSoftDeletes();
        });

        // Remove soft deletes from document_creations table
        Schema::table('document_creations', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
            $table->dropSoftDeletes();
        });

        // Remove soft deletes from sale_contracts table
        Schema::table('sale_contracts', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
            $table->dropSoftDeletes();
        });

        // Remove deleted_by from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
        });

        // Remove deleted_by from roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('deleted_by');
        });
    }
};
