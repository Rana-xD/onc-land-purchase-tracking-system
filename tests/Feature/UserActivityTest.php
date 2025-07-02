<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserActivityTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_all_activities()
    {
        // Create an admin user
        $admin = User::factory()->create([
            'role' => 'administrator',
        ]);

        // Create some activities
        UserActivity::factory()->count(5)->create();

        // Admin should be able to access the activities page
        $response = $this->actingAs($admin)->get(route('activities.index'));
        $response->assertStatus(200);
    }

    public function test_staff_cannot_view_all_activities()
    {
        // Create a staff user
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        // Create some activities
        UserActivity::factory()->count(5)->create();

        // Staff should not be able to access the activities page
        $response = $this->actingAs($staff)->get(route('activities.index'));
        $response->assertStatus(403);
    }

    public function test_user_can_view_own_activities()
    {
        // Create a user
        $user = User::factory()->create();

        // Create activities for this user
        UserActivity::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        // User should be able to access their own activities
        $response = $this->actingAs($user)->get(route('activities.my'));
        $response->assertStatus(200);
    }

    public function test_middleware_logs_user_login()
    {
        // Create a user
        $user = User::factory()->create();

        // Simulate login
        $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // Check if login activity was logged
        $this->assertDatabaseHas('user_activities', [
            'user_id' => $user->id,
            'action' => 'ចូលប្រព័ន្ធ', // Login
        ]);
    }

    public function test_cleanup_command_removes_old_activities()
    {
        // Create some old activities (more than 90 days old)
        UserActivity::factory()->count(5)->create([
            'created_at' => now()->subDays(100),
        ]);

        // Create some recent activities
        UserActivity::factory()->count(5)->create();

        // Count activities before cleanup
        $beforeCount = UserActivity::count();
        $this->assertEquals(10, $beforeCount);

        // Run the cleanup command
        $this->artisan('activities:cleanup --days=90');

        // Count activities after cleanup
        $afterCount = UserActivity::count();
        $this->assertEquals(5, $afterCount);
    }
}
