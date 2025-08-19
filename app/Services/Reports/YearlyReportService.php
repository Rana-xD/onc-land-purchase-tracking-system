<?php

namespace App\Services\Reports;

use App\Models\DocumentCreation;
use App\Models\Land;
use App\Models\PaymentStep;
use App\Models\SaleContract;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class YearlyReportService
{
    /**
     * Generate yearly report data aggregated by contract, land, and month/year
     *
     * @param int|string $year - Year number or 'all' for all years
     * @return array
     */
    public function generateYearlyReport($year): array
    {
        // Get all sale contracts with their payment steps
        $saleContracts = SaleContract::with([
            'documentCreation',
            'documentCreation.lands.land',
            'documentCreation.buyers.buyer',
            'documentCreation.sellers.seller', // Load sellers through pivot table
            'paymentSteps' => function ($query) use ($year) {
                if ($year === 'all') {
                    $query->orderBy('due_date', 'asc');
                } else {
                    $query->whereYear('due_date', $year)
                          ->orderBy('due_date', 'asc');
                }
            }
        ])->get();

        $reportData = [];
        $summary = [
            'total_amount' => 0,
            'paid_amount' => 0,
            'unpaid_amount' => 0,
            'contracts_count' => 0,
            'lands_count' => 0
        ];

        // Process each contract
        foreach ($saleContracts as $contract) {
            if (!$contract->documentCreation) {
                continue;
            }

            $contractData = $this->processContract($contract, $year);
            
            if (!empty($contractData)) {
                $reportData[] = $contractData;
                
                // Update summary
                $summary['total_amount'] += $contractData['total_amount'];
                $summary['paid_amount'] += $contractData['paid_amount'];
                $summary['unpaid_amount'] += $contractData['unpaid_amount'];
                $summary['contracts_count']++;
                $summary['lands_count'] += count($contractData['lands']);
            }
        }

        return [
            'contracts' => $reportData,
            'summary' => $summary,
            'year' => $year,
            'is_all_years' => $year === 'all'
        ];
    }

    /**
     * Process a single contract for the yearly report
     *
     * @param SaleContract $contract
     * @param int|string $year
     * @return array
     */
    protected function processContract(SaleContract $contract, $year): array
    {
        $documentCreation = $contract->documentCreation;
        $lands = $documentCreation->lands;
        $buyers = $documentCreation->buyers;
        $sellers = $documentCreation->sellers;
        
        if ($lands->isEmpty()) {
            return [];
        }

        // Initialize data structure based on year selection
        $timeData = [];
        $totalAmount = 0;
        $paidAmount = 0;
        $unpaidAmount = 0;

        if ($year === 'all') {
            // Initialize yearly data structure for all years mode
            $currentYear = Carbon::now()->year;
            for ($y = $currentYear - 6; $y <= $currentYear + 6; $y++) {
                $timeData[$y] = [
                    'paid' => 0,
                    'unpaid' => 0
                ];
            }

            // Process payment steps for all years
            foreach ($contract->paymentSteps as $step) {
                $stepYear = Carbon::parse($step->due_date)->year;
                $amount = $step->amount;
                $totalAmount += $amount;
                
                // Only include years within our range
                if ($stepYear >= $currentYear - 6 && $stepYear <= $currentYear + 6) {
                    if ($step->status === 'paid') {
                        $timeData[$stepYear]['paid'] += $amount;
                        $paidAmount += $amount;
                    } else {
                        $timeData[$stepYear]['unpaid'] += $amount;
                        $unpaidAmount += $amount;
                    }
                }
            }
        } else {
            // Initialize monthly data structure for specific year
            for ($month = 1; $month <= 12; $month++) {
                $timeData[$month] = [
                    'paid' => 0,
                    'unpaid' => 0
                ];
            }

            // Process payment steps for specific year
            foreach ($contract->paymentSteps as $step) {
                $month = Carbon::parse($step->due_date)->month;
                $amount = $step->amount;
                $totalAmount += $amount;
                
                if ($step->status === 'paid') {
                    $timeData[$month]['paid'] += $amount;
                    $paidAmount += $amount;
                } else {
                    $timeData[$month]['unpaid'] += $amount;
                    $unpaidAmount += $amount;
                }
            }
        }

        // Format lands data
        $landsData = $lands->map(function ($documentLand) {
            // Get the actual Land model through the relationship
            $land = $documentLand->land;
            
            return [
                'id' => $documentLand->id,
                'plot_number' => $land ? $land->plot_number : null,
                'address' => $land ? $land->location : null
            ];
        });

        // Format buyers data
        $buyersData = $buyers->map(function ($documentBuyer) {
            $buyer = $documentBuyer->buyer;
            return [
                'id' => $buyer->id,
                'name' => $buyer->name
            ];
        });

        // Format sellers data (max 2 sellers)
        $sellersData = $sellers->take(2)->map(function ($documentSeller) {
            $seller = $documentSeller->seller;
            return [
                'id' => $seller->id,
                'name' => $seller->name
            ];
        });

        return [
            'contract_id' => $contract->contract_id,
            'lands' => $landsData,
            'buyers' => $buyersData,
            'sellers' => $sellersData,
            'time_data' => $timeData, // Can be monthly_data or yearly_data
            'monthly_data' => $timeData, // Keep for backward compatibility
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'unpaid_amount' => $unpaidAmount
        ];
    }

    /**
     * Export yearly report as PDF or Excel
     *
     * @param int|string $year
     * @param string $format
     * @param \App\Models\User $user
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportYearlyReport($year, string $format, $user)
    {
        // Get report data
        $reportData = $this->generateYearlyReport($year);
        
        // Use the YearlyExportService for actual export
        $exportService = new \App\Services\Reports\YearlyExportService();
        return $exportService->exportYearlyReport($reportData, $format, $year, $user);
    }
}
