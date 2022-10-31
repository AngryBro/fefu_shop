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
            $table->string('name_internal');
            $table->string('name');
            $table->json('images');
            $table->string('article');
            $table->float('price');
            $table->float('discount')->nullable();
            $table->text('description');
            $table->float('price_discount')->nullable();
            $table->integer('count');
            $table->foreignId('color_id');
            $table->foreignId('size_id');
            $table->boolean('new');
            $table->foreignId('brand_id');
            $table->foreignId('material_id');
            $table->boolean('onfitting');
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
