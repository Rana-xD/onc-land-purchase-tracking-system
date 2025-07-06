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
    
    /**
     * API endpoint for payment overview data
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function paymentOverview()
    {
        // Return dummy data for now
        // In a real application, this would come from the payment models
        return response()->json([
            'paid' => 150000,
            'unpaid' => 350000,
            'total' => 500000
        ]);
    }
    
    /**
     * API endpoint for upcoming payments
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function upcomingPayments()
    {
        // Return dummy data for now
        // In a real application, this would come from the payment models
        return response()->json([
            [
                'id' => 1,
                'date' => '15/07/2025',
                'buyer' => 'សុខ វិចិត្រ',
                'landPlot' => 'A-123',
                'amount' => 5000
            ],
            [
                'id' => 2,
                'date' => '22/07/2025',
                'buyer' => 'ម៉ៅ សុខហួរ',
                'landPlot' => 'B-456',
                'amount' => 3500
            ],
            [
                'id' => 3,
                'date' => '05/08/2025',
                'buyer' => 'អ៊ុំ សុវណ្ណារី',
                'landPlot' => 'C-789',
                'amount' => 4200
            ],
            [
                'id' => 4,
                'date' => '18/08/2025',
                'buyer' => 'ឈឹម សុភា',
                'landPlot' => 'D-101',
                'amount' => 2800
            ],
            [
                'id' => 5,
                'date' => '02/09/2025',
                'buyer' => 'សែម សុផល',
                'landPlot' => 'A-234',
                'amount' => 3000
            ],
            [
                'id' => 6,
                'date' => '15/09/2025',
                'buyer' => 'ឃុន សុខា',
                'landPlot' => 'B-567',
                'amount' => 2500
            ],
            [
                'id' => 7,
                'date' => '01/10/2025',
                'buyer' => 'ឆាយ វាសនា',
                'landPlot' => 'C-890',
                'amount' => 4000
            ],
        ]);
    }
}
