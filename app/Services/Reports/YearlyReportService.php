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
     * Generate yearly report data aggregated by contract, land, and month
     *
     * @param int $year
     * @return array
     */
    public function generateYearlyReport(int $year): array
    {
        // Get all sale contracts with their payment steps
        $saleContracts = SaleContract::with([
            'documentCreation',
            'documentCreation.lands.land', // Include the actual Land model through the DocumentLand relationship
            'documentCreation.buyers',
            'paymentSteps' => function ($query) use ($year) {
                $query->whereYear('due_date', $year)
                    ->orderBy('due_date', 'asc');
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
            'year' => $year
        ];
    }

    /**
     * Process a single contract for the yearly report
     *
     * @param SaleContract $contract
     * @param int $year
     * @return array
     */
    protected function processContract(SaleContract $contract, int $year): array
    {
        $documentCreation = $contract->documentCreation;
        $lands = $documentCreation->lands;
        $buyers = $documentCreation->buyers;
        
        if ($lands->isEmpty()) {
            return [];
        }

        // Initialize monthly data structure
        $monthlyData = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthlyData[$month] = [
                'paid' => 0,
                'unpaid' => 0
            ];
        }

        // Process payment steps for this contract
        $totalAmount = 0;
        $paidAmount = 0;
        $unpaidAmount = 0;

        foreach ($contract->paymentSteps as $step) {
            $month = Carbon::parse($step->due_date)->month;
            $amount = $step->amount;
            $totalAmount += $amount;
            
            if ($step->status === 'paid') {
                $monthlyData[$month]['paid'] += $amount;
                $paidAmount += $amount;
            } else {
                $monthlyData[$month]['unpaid'] += $amount;
                $unpaidAmount += $amount;
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
        $buyersData = $buyers->map(function ($buyer) {
            return [
                'id' => $buyer->id,
                'name' => $buyer->name
            ];
        });

        return [
            'contract_id' => $contract->contract_id,
            'lands' => $landsData,
            'buyers' => $buyersData,
            'monthly_data' => $monthlyData,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'unpaid_amount' => $unpaidAmount
        ];
    }

    /**
     * Export yearly report as PDF or Excel
     *
     * @param int $year
     * @param string $format
     * @param \App\Models\User $user
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportYearlyReport(int $year, string $format, $user)
    {
        // Get report data
        $reportData = $this->generateYearlyReport($year);
        
        // Use the YearlyExportService for actual export
        $exportService = new \App\Services\Reports\YearlyExportService();
        return $exportService->exportYearlyReport($reportData, $format, $year, $user);
    }
}
