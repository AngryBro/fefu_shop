<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('info_pages', function (Blueprint $table) {
            $table->id();
            $table->string('header')->unique();
            $table->string('slug')->unique();
            $table->text('text1');
            $table->text('text2');
            $table->string('image_header')->nullable();
            $table->json('images')->nullable();
            $table->boolean('hidden');
            $table->integer('place');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('info_pages');
    }
};
