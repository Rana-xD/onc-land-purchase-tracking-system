<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Land;
use App\Models\PaymentStep;
use App\Models\SaleContract;
use App\Models\DocumentCreation;
use App\Models\ContractDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics.
     */
    public function index()
    {
        // Check if user has permission to view dashboard
        if (!Auth::user()->hasPermission('dashboard.view')) {
            abort(403, 'Unauthorized');
        }

        // Get user count
        $userCount = User::count();
        
        // Get real data from models
        $landCount = Land::count();
        $paymentTotal = PaymentStep::where('status', 'paid')->sum('amount');
        $documentCount = ContractDocument::count();
        
        return Inertia::render('Dashboard', [
            'stats' => [
                'userCount' => $userCount,
                'landCount' => $landCount,
                'paymentTotal' => $paymentTotal,
                'documentCount' => $documentCount,
            ],
        ]);
    }
    
    /**
     * API endpoint for payment overview data
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function paymentOverview()
    {
        // Check if user has permission to view dashboard
        if (!Auth::user()->hasPermission('dashboard.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get all payment steps from contracts
        $paymentSteps = PaymentStep::all();
        
        // Calculate paid and unpaid amounts
        $paid = $paymentSteps->where('status', 'paid')->sum('amount');
        $unpaid = $paymentSteps->where('status', 'unpaid')->sum('amount');
        $total = $paid + $unpaid;
        
        return response()->json([
            'paid' => $paid,
            'unpaid' => $unpaid,
            'total' => $total
        ]);
    }
    
    /**
     * API endpoint for upcoming payments
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function upcomingPayments()
    {
        // Check if user has permission to view dashboard
        if (!Auth::user()->hasPermission('dashboard.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get current date and date 6 months from now
        $today = Carbon::now()->startOfMonth();
        $sixMonthsLater = Carbon::now()->addMonths(5)->endOfMonth();
        
        // Get ALL payment steps with due dates in the next 6 months regardless of status
        $paymentSteps = PaymentStep::whereBetween('due_date', [$today, $sixMonthsLater])
            ->get();
        
        // Group payments by month and sum the amounts
        $monthlyPayments = [];
        
        foreach ($paymentSteps as $step) {
            $dueDate = Carbon::parse($step->due_date);
            $monthYear = $dueDate->format('m-Y'); // Format: 07-2025
            $monthName = $dueDate->format('m/Y'); // Format: 07/2025 for display
            
            if (!isset($monthlyPayments[$monthYear])) {
                $monthlyPayments[$monthYear] = [
                    'id' => $monthYear,
                    'date' => $monthName,
                    'amount' => 0
                ];
            }
            
            $monthlyPayments[$monthYear]['amount'] += $step->amount;
        }
        
        // Sort by month and convert to indexed array
        ksort($monthlyPayments);
        $result = array_values($monthlyPayments);
        
        // Ensure we have exactly 6 months of data
        $currentMonth = Carbon::now()->startOfMonth();
        for ($i = 0; $i < 6; $i++) {
            $monthDate = $currentMonth->copy()->addMonths($i);
            $monthYear = $monthDate->format('m-Y');
            $monthName = $monthDate->format('m/Y');
            
            // Check if this month exists in our results
            $exists = false;
            foreach ($result as $item) {
                if ($item['id'] === $monthYear) {
                    $exists = true;
                    break;
                }
            }
            
            // If not, add it with zero amount
            if (!$exists) {
                $result[] = [
                    'id' => $monthYear,
                    'date' => $monthName,
                    'amount' => 0
                ];
            }
        }
        
        // Sort again to ensure chronological order
        usort($result, function($a, $b) {
            return strcmp($a['id'], $b['id']);
        });
        
        // Limit to 6 months
        $result = array_slice($result, 0, 6);
        
        return response()->json($result);
    }
}
