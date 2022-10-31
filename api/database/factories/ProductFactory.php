<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $price = $this->faker->randomFloat(2,100,999);
        $discount = $this->faker->randomFloat(2,0,100);
        $images = [
            str_replace(env('APP_URL'), '', route('productImage',['id' => 'id', 'file' => 'file'])),
            str_replace(env('APP_URL'), '', route('productImage',['id' => 'id', 'file' => 'file'])),
            str_replace(env('APP_URL'), '', route('productImage',['id' => 'id', 'file' => 'file']))
        ];
        return [
            'name' => $this->faker->word(),
            'name_internal' => $this->faker->word(),
            'images' => json_encode($images),
            'category_id' => $this->faker->numberBetween(1,5),
            'article' => $this->faker->unique()->numberBetween(100,999),
            'price' => $price,
            'discount' => $discount,
            'price_discount' => $price-$discount,
            'description' => $this->faker->text(),
            'color_id' => $this->faker->numberBetween(1,3),
            'new' => $this->faker->numberBetween(0,1)?true:false,
            'size_id' => $this->faker->numberBetween(1,5),
            'count' => $this->faker->randomDigit(),
            'brand_id' => $this->faker->numberBetween(1,3),
            'material_id' => $this->faker->numberBetween(1,3),
            'onfitting' => $this->faker->numberBetween(0,1)?true:false
        ];
    }
}
