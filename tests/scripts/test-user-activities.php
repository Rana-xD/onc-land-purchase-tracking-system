<?php

/**
 * This script helps test the user activity logging system
 * Run it with: php tests/scripts/test-user-activities.php
 */

require_once __DIR__ . '/../../vendor/autoload.php';

$app = require_once __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\UserActivity;
use App\Services\UserActivityService;
use Illuminate\Support\Facades\DB;

echo "Cambodia Land Purchase Tracking System - User Activity Test Script\n";
echo "=============================================================\n\n";

// Count existing activities
$activityCount = UserActivity::count();
echo "Current activity count: {$activityCount}\n";

// Get a random user
$user = User::inRandomOrder()->first();
if (!$user) {
    echo "No users found. Please run seeders first.\n";
    exit(1);
}

echo "Selected user: {$user->name} (ID: {$user->id}, Role: {$user->role})\n";

// Create a test activity using the service
$activityService = app(UserActivityService::class);
$activityService->log(
    $user->id,
    'ការធ្វើតេស្ត', // Test action
    'ការធ្វើតេស្តប្រព័ន្ធកត់ត្រាសកម្មភាព', // Testing activity logging system
    '127.0.0.1'
);

// Verify the activity was created
$newActivityCount = UserActivity::count();
echo "New activity count: {$newActivityCount}\n";

if ($newActivityCount > $activityCount) {
    echo "✅ Success! New activity was logged.\n";
    
    // Display the new activity
    $latestActivity = UserActivity::latest()->first();
    echo "\nLatest activity details:\n";
    echo "User: {$latestActivity->user->name}\n";
    echo "Action: {$latestActivity->action}\n";
    echo "Description: {$latestActivity->description}\n";
    echo "IP: {$latestActivity->ip_address}\n";
    echo "Created at: {$latestActivity->created_at}\n";
} else {
    echo "❌ Error: Failed to log new activity.\n";
}

// Test cleanup command (simulation only)
echo "\nSimulating cleanup of activities older than 30 days...\n";
$oldCount = UserActivity::where('created_at', '<', now()->subDays(30))->count();
echo "Activities older than 30 days: {$oldCount}\n";
echo "To actually perform cleanup, run: php artisan activities:cleanup --days=30\n";

echo "\nDone.\n";
