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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id');
            $table->string('slug')->unique();
            $table->string('name')->unique();
            $table->string('image_preview')->nullable();
            $table->string('article');
            $table->integer('price');
            $table->integer('discount');
            $table->text('description');
            $table->integer('price_discount');
            $table->foreignId('color_id');
            $table->integer('XS')->nullable();
            $table->integer('S')->nullable();
            $table->integer('M')->nullable();
            $table->integer('L')->nullable();
            $table->integer('XL')->nullable();
            $table->boolean('new');
            $table->boolean('show');
            $table->foreignId('brand_id');
            $table->foreignId('material_id');
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
        Schema::dropIfExists('products');
    }
};
