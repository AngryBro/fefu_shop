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
        Schema::create('order_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(App\Models\Order::class);
            $table->foreignIdFor(App\Models\Product::class);
            $table->foreignIdFor(App\Models\Size::class);
            $table->integer('count');
            $table->integer('price');
            $table->integer('price_discount');
            $table->integer('discount');
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
        Schema::dropIfExists('order_positions');
    }
};
