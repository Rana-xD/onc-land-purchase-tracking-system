<?php

namespace App\Services\Reports;

use App\Models\PaymentStep;
use App\Models\SaleContract;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MonthlyReportService
{
    /**
     * Get monthly report data based on date range
     *
     * @param string $startDate
     * @param string $endDate
     * @return array
     */
    public function getMonthlyReportData(string $startDate, string $endDate): array
    {
        try {
        // Convert dates to Carbon instances
        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();

        // Get payment steps within the date range
        $paymentSteps = PaymentStep::with(['documentCreation', 'documents'])
            ->whereBetween('due_date', [$startDate, $endDate])
            ->orderBy('due_date')
            ->get();
            
        // Filter out payment steps that don't have a valid document creation
        $paymentSteps = $paymentSteps->filter(function ($step) {
            return $step->documentCreation !== null;
        });

        // Group payment steps by month
        $paymentsByMonth = $paymentSteps->groupBy(function ($step) {
            return Carbon::parse($step->due_date)->format('Y-m');
        });

        // Format data for the report
        $monthlyData = [];
        $totalAmount = 0;
        $totalPaid = 0;
        $totalOverdue = 0;
        $totalPending = 0;

        foreach ($paymentsByMonth as $month => $steps) {
            $monthName = Carbon::parse($month . '-01')->format('F Y');
            $monthlyTotal = $steps->sum('amount');
            $monthlyPaid = $steps->where('status', 'paid')->sum('amount');
            $monthlyOverdue = $steps->where('status', 'overdue')->sum('amount');
            $monthlyPending = $steps->whereIn('status', ['pending', 'contract_created'])->sum('amount');

            $totalAmount += $monthlyTotal;
            $totalPaid += $monthlyPaid;
            $totalOverdue += $monthlyOverdue;
            $totalPending += $monthlyPending;

            $monthlyData[$month] = [
                'month_name' => $monthName,
                'total_amount' => $monthlyTotal,
                'total_paid' => $monthlyPaid,
                'total_overdue' => $monthlyOverdue,
                'total_pending' => $monthlyPending,
                'payment_steps' => $this->formatPaymentSteps($steps),
            ];
        }

        // Sort by month
        ksort($monthlyData);

        return [
            'monthly_data' => $monthlyData,
            'summary' => [
                'total_amount' => $totalAmount,
                'total_paid' => $totalPaid,
                'total_overdue' => $totalOverdue,
                'total_pending' => $totalPending,
                'payment_steps_count' => $paymentSteps->count(),
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ];
        } catch (\Exception $e) {
            Log::error('Error generating monthly report: ' . $e->getMessage());
            return [
                'monthly_data' => [],
                'summary' => [
                    'total_amount' => 0,
                    'total_paid' => 0,
                    'total_overdue' => 0,
                    'total_pending' => 0,
                    'payment_steps_count' => 0,
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d'),
                ],
                'error' => 'An error occurred while generating the report.'
            ];
        }
    }

    /**
     * Format payment steps for the report
     *
     * @param \Illuminate\Support\Collection $steps
     * @return array
     */
    protected function formatPaymentSteps($steps): array
    {
        return $steps->map(function ($step) {
            $saleContract = $step->documentCreation->saleContract;
            
            return [
                'id' => $step->id,
                'step_number' => $step->step_number,
                'payment_description' => $step->payment_time_description,
                'amount' => $step->amount,
                'due_date' => $step->due_date->format('Y-m-d'),
                'status' => $step->status,
                'contract_id' => $saleContract ? $saleContract->contract_id : 'N/A',
                'buyer_name' => $saleContract ? $saleContract->buyer_name : 'N/A',
                'seller_name' => $saleContract ? $saleContract->seller_name : 'N/A',
                'land_info' => $saleContract && $saleContract->land ? [
                    'plot_number' => $saleContract->land->plot_number ?? 'N/A',
                    'location' => $saleContract->land->location ?? 'N/A',
                ] : [
                    'plot_number' => 'N/A',
                    'location' => 'N/A',
                ],
                'has_documents' => $step->documents->isNotEmpty(),
                'payment_contract_created' => $step->payment_contract_created,
            ];
        })->toArray();
    }

    /**
     * Update payment step statuses
     * This should be run regularly to update overdue payments
     *
     * @return int Number of updated records
     */
    public function updatePaymentStepStatuses(): int
    {
        $today = Carbon::now()->startOfDay();
        
        // Update overdue payments
        $overdueCount = PaymentStep::where('status', 'pending')
            ->where('due_date', '<', $today)
            ->update(['status' => 'overdue']);
            
        return $overdueCount;
    }
}
