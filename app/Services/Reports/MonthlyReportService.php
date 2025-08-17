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

            // Get payment steps within the date range with eager loading for all related data
            // Include soft-deleted document creations and sale contracts
            $paymentSteps = PaymentStep::with([
                'documentCreation' => function($query) {
                    $query->withTrashed()->with([
                        'saleContract' => function($subQuery) {
                            $subQuery->withTrashed();
                        },
                        'lands.land' => function($subQuery) {
                            $subQuery->withTrashed();
                        },
                        'sellers.seller' => function($subQuery) {
                            $subQuery->withTrashed();
                        },
                        'buyers.buyer' => function($subQuery) {
                            $subQuery->withTrashed();
                        }
                    ]);
                }
            ])
            ->whereBetween('due_date', [$startDate, $endDate])
            ->orderBy('due_date')
            ->get();
            
            // Filter out payment steps that don't have a valid document creation or sale contract
            // But only filter if they are actually null, not just soft-deleted
            $paymentSteps = $paymentSteps->filter(function ($step) {
                return $step->documentCreation !== null && $step->documentCreation->saleContract !== null;
            });

            // Format payment steps for the simple list view
            $formattedPayments = $this->formatPaymentSteps($paymentSteps);
            
            // Calculate total amount
            $totalAmount = $paymentSteps->sum('amount');

            return [
                'payments' => $formattedPayments,
                'summary' => [
                    'total_amount' => $totalAmount,
                    'payment_steps_count' => $paymentSteps->count(),
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d'),
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error generating monthly report: ' . $e->getMessage());
            return [
                'payments' => [],
                'summary' => [
                    'total_amount' => 0,
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
            $documentCreation = $step->documentCreation;
            $saleContract = $documentCreation->saleContract;
            
            // Get all lands from the document creation
            $lands = [];
            if ($documentCreation->lands->isNotEmpty()) {
                $lands = $documentCreation->lands->map(function ($documentLand) {
                    return [
                        'plot_number' => $documentLand->land->plot_number ?? 'N/A',
                        'id' => $documentLand->land->id ?? null
                    ];
                })->toArray();
            }
            
            // Get land plot number from the first land (for backward compatibility)
            $landPlotNumber = 'N/A';
            if (!empty($lands)) {
                $landPlotNumber = $lands[0]['plot_number'];
            }
            
            // Get all seller names as a comma-separated string
            $sellerNames = $documentCreation->sellers->map(function ($documentSeller) {
                return $documentSeller->seller->name ?? 'N/A';
            })->implode(', ');
            
            // If no sellers found, fall back to the contract seller name
            if (empty($sellerNames) && $saleContract) {
                $sellerNames = $saleContract->seller_name ?? 'N/A';
            }
            
            // Format sellers for the frontend
            $sellers = $documentCreation->sellers->map(function ($documentSeller) {
                return [
                    'name' => $documentSeller->seller->name ?? 'N/A',
                    'full_info' => $documentSeller->seller->name . ' - ' . ($documentSeller->seller->id_number ?? 'No ID')
                ];
            })->toArray();
            
            // Get all buyer names as a comma-separated string
            $buyerNames = $documentCreation->buyers->map(function ($documentBuyer) {
                return $documentBuyer->buyer->name ?? 'N/A';
            })->implode(', ');
            
            // If no buyers found, fall back to the contract buyer name
            if (empty($buyerNames) && $saleContract) {
                $buyerNames = $saleContract->buyer_name ?? 'N/A';
            }
            
            // Format buyers for the frontend
            $buyers = $documentCreation->buyers->map(function ($documentBuyer) {
                return [
                    'name' => $documentBuyer->buyer->name ?? 'N/A',
                    'full_info' => $documentBuyer->buyer->name . ' - ' . ($documentBuyer->buyer->id_number ?? 'No ID')
                ];
            })->toArray();
            
            return [
                'id' => $step->id,
                'contract_id' => $saleContract->contract_id ?? 'N/A',
                'land_plot_number' => $landPlotNumber,
                'lands' => $lands,                   // Add all lands as an array
                'seller_names' => $sellerNames,
                'sellers' => $sellers,               // Add formatted sellers
                'buyer_names' => $buyerNames,        // Add buyer names
                'buyers' => $buyers,                 // Add formatted buyers
                'step_number' => $step->step_number,
                'amount' => $step->amount,
                'due_date' => $step->due_date->format('Y-m-d'),
                'status' => $step->status,
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
