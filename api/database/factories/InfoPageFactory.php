<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InfoPage>
 */
class InfoPageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'header' => $this->faker->unique()->word(),
            'text1' => $this->faker->text(),
            'text2' => $this->faker->text(),
            'slug' => $this->faker->unique()->word(),
            // 'image_header' => 'link_header',
            // 'images' => json_encode(['link1', 'link2']),
            'hidden' => false
        ];
    }
}
