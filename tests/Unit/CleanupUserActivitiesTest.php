<?php

namespace Tests\Unit;

use App\Console\Commands\CleanupUserActivities;
use App\Models\UserActivity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CleanupUserActivitiesTest extends TestCase
{
    use RefreshDatabase;

    public function test_cleanup_command_removes_old_activities()
    {
        // Create some old activities (more than 90 days old)
        UserActivity::factory()->count(5)->create([
            'created_at' => now()->subDays(100),
        ]);

        // Create some recent activities
        UserActivity::factory()->count(5)->create([
            'created_at' => now()->subDays(30),
        ]);

        // Count activities before cleanup
        $beforeCount = UserActivity::count();
        $this->assertEquals(10, $beforeCount);

        // Run the cleanup command with default 90 days
        $this->artisan('activities:cleanup')
            ->expectsOutput('Deleted activities older than 90 days.')
            ->assertExitCode(0);

        // Count activities after cleanup
        $afterCount = UserActivity::count();
        $this->assertEquals(5, $afterCount);
        
        // Verify only recent activities remain
        $this->assertEquals(5, UserActivity::where('created_at', '>', now()->subDays(90))->count());
    }

    public function test_cleanup_command_with_custom_days()
    {
        // Create activities with different ages
        UserActivity::factory()->count(3)->create([
            'created_at' => now()->subDays(60),
        ]);
        
        UserActivity::factory()->count(3)->create([
            'created_at' => now()->subDays(20),
        ]);

        // Count activities before cleanup
        $beforeCount = UserActivity::count();
        $this->assertEquals(6, $beforeCount);

        // Run the cleanup command with custom 30 days
        $this->artisan('activities:cleanup', ['--days' => 30])
            ->expectsOutput('Deleted activities older than 30 days.')
            ->assertExitCode(0);

        // Count activities after cleanup
        $afterCount = UserActivity::count();
        $this->assertEquals(3, $afterCount);
        
        // Verify only activities newer than 30 days remain
        $this->assertEquals(3, UserActivity::where('created_at', '>', now()->subDays(30))->count());
    }
}
