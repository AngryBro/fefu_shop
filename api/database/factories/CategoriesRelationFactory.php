<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CategoriesRelation>
 */
class CategoriesRelationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'child_id' => $this->faker->unique()->numberBetween(1,20),
            'parent_id' => $this->faker->numberBetween(21,25)
        ];
    }
}
