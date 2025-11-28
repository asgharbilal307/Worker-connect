<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobPosts>
 */
class JobPostsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'customer_id' => Customer::inRandomOrder()->first()->id,
            'job_description' => $this->faker->sentence(6),
            'job_location' => $this->faker->city(),
            'status' => $this->faker->randomElement(['active', 'inactive','in_process', 'completed']),
            'budget' => $this->faker->numberBetween(500, 50000),
            'skills_id' => $this->faker->numberBetween(1, 5),
        ];
    }
}
