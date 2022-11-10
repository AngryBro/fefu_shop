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
        $price = $this->faker->numberBetween(100,999);
        $discount = $this->faker->numberBetween(0,100);
        $image = str_replace(env('APP_URL'), '', route('productImage',['id' => 'id', 'file' => 'file']));
        return [
            'name' => $this->faker->word(),
            'name_internal' => $this->faker->word(),
            'image_preview' => $image,
            'category_id' => $this->faker->numberBetween(1,5),
            'article' => $this->faker->numberBetween(100,150),
            'price' => $price,
            'discount' => $discount,
            'price_discount' => $price-$discount,
            'description' => $this->faker->text(),
            'color_id' => $this->faker->numberBetween(1,3),
            'new' => $this->faker->numberBetween(0,1)?true:false,
            'show' => true,
            'brand_id' => $this->faker->numberBetween(1,3),
            'material_id' => $this->faker->numberBetween(1,3),
            'XS' => (function() {$a = $this->faker->numberBetween(-5,10); return $a===-5?null:$a;})(),
            'S' => (function() {$a = $this->faker->numberBetween(-5,10); return $a===-5?null:$a;})(),
            'M' => (function() {$a = $this->faker->numberBetween(-5,10); return $a===-5?null:$a;})(),
            'L' => (function() {$a = $this->faker->numberBetween(-5,10); return $a===-5?null:$a;})(),
            'XL' => (function() {$a = $this->faker->numberBetween(-5,10); return $a===-5?null:$a;})(),
        ];
    }
}
