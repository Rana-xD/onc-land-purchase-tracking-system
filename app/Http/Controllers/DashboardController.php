<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics and recent activities.
     */
    public function index()
    {
        // Get recent activities (last 10)
        $recentActivities = UserActivity::with('user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        
        // Get user count
        $userCount = User::count();
        
        // For now, we'll use placeholder values for other stats
        // In a real application, these would come from actual models
        $landCount = 42;
        $paymentTotal = 152000;
        $documentCount = 85;
        
        return Inertia::render('Dashboard', [
            'stats' => [
                'userCount' => $userCount,
                'landCount' => $landCount,
                'paymentTotal' => $paymentTotal,
                'documentCount' => $documentCount,
            ],
            'recentActivities' => $recentActivities,
        ]);
    }
}
