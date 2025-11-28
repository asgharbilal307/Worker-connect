<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Worker>
 */
class WorkerFactory extends Factory
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
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('12345678'),
            'phone' => $this->faker->phoneNumber(),
            'city' => $this->faker->city(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'role' => 'worker',
            'cnic' => $this->faker->numerify('#####-#######-#'),
            'experience' => $this->faker->numberBetween(1, 10),
            'daily_charge' => $this->faker->numberBetween(500, 5000),
            'availability' => $this->faker->boolean(),
            'bio' => $this->faker->text(),
            'skills_id' => $this->faker->numberBetween(1, 5),
        ];
    }
}
