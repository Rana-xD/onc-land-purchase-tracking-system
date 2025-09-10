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
        Schema::table('buyers', function (Blueprint $table) {
            $table->string('front_image_path')->nullable()->after('phone_number');
            $table->string('back_image_path')->nullable()->after('front_image_path');
        });

        Schema::table('sellers', function (Blueprint $table) {
            $table->string('front_image_path')->nullable()->after('phone_number');
            $table->string('back_image_path')->nullable()->after('front_image_path');
        });

        Schema::table('lands', function (Blueprint $table) {
            $table->string('front_image_path')->nullable()->after('location');
            $table->string('back_image_path')->nullable()->after('front_image_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('buyers', function (Blueprint $table) {
            $table->dropColumn(['front_image_path', 'back_image_path']);
        });

        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn(['front_image_path', 'back_image_path']);
        });

        Schema::table('lands', function (Blueprint $table) {
            $table->dropColumn(['front_image_path', 'back_image_path']);
        });
    }
};
