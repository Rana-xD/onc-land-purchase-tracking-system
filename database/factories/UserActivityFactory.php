<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserActivity>
 */
class UserActivityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = UserActivity::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = [
            'ចូលប្រព័ន្ធ', // Login
            'ចាកចេញពីប្រព័ន្ធ', // Logout
            'មើលទិន្នន័យ', // View data
            'បង្កើតទិន្នន័យថ្មី', // Create new data
            'កែប្រែទិន្នន័យ', // Edit data
            'លុបទិន្នន័យ', // Delete data
        ];
        
        $descriptions = [
            'ចូលប្រព័ន្ធដោយជោគជ័យ', // Login successful
            'ចាកចេញពីប្រព័ន្ធដោយជោគជ័យ', // Logout successful
            'មើលទិន្នន័យដី', // View land data
            'បង្កើតកំណត់ត្រាដីថ្មី', // Create new land record
            'កែប្រែព័ត៌មានដី', // Edit land information
            'លុបកំណត់ត្រាដី', // Delete land record
        ];

        return [
            'user_id' => User::factory(),
            'action' => $this->faker->randomElement($actions),
            'description' => $this->faker->randomElement($descriptions),
            'ip_address' => $this->faker->ipv4(),
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
