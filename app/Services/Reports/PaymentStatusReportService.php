<?php

namespace App\Services\Reports;

use App\Models\PaymentStep;
use App\Models\SaleContract;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentStatusReportService
{
    /**
     * Get payment status report data
     *
     * @return array
     */
    public function getPaymentStatusReportData(): array
    {
        try {
            // Get all sale contracts with eager loading for all related data
            // Include soft-deleted related records
            $saleContracts = SaleContract::with([
                'documentCreation.lands.land',
                'documentCreation.sellers.seller', // Load sellers through pivot table
                'paymentSteps' => function ($query) {
                    $query->orderBy('due_date', 'asc');
                }
            ])->get();
            
            // Debug: Log the number of contracts found
            Log::info('Payment Status Report - Contracts found: ' . $saleContracts->count());
            
            // Debug: Log contract IDs
            $contractIds = $saleContracts->pluck('id')->toArray();
            Log::info('Payment Status Report - Contract IDs: ' . implode(', ', $contractIds));
            
            // Debug: Log each contract's payment steps
            foreach ($saleContracts as $contract) {
                Log::info('Contract ID: ' . $contract->id . ', Contract Number: ' . $contract->contract_id, [
                    'has_document_creation' => $contract->documentCreation ? 'yes' : 'no',
                    'payment_steps_count' => $contract->paymentSteps->count(),
                    'payment_steps' => $contract->paymentSteps->toArray()
                ]);
            }
            
            // Format contracts for the report
            $formattedContracts = $this->formatContracts($saleContracts);
            Log::info('Formatted contracts count: ' . count($formattedContracts));
            
            // Calculate summary data
            $totalAmount = $saleContracts->sum(function ($contract) {
                return $contract->paymentSteps->sum('amount');
            });
            
            $totalPaid = $saleContracts->sum(function ($contract) {
                return $contract->paymentSteps->where('status', 'paid')->sum('amount');
            });
            
            $totalUnpaid = $totalAmount - $totalPaid;

            return [
                'contracts' => $formattedContracts,
                'summary' => [
                    'total_amount' => $totalAmount,
                    'total_paid' => $totalPaid,
                    'total_unpaid' => $totalUnpaid,
                    'contracts_count' => $saleContracts->count(),
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error generating payment status report: ' . $e->getMessage());
            return [
                'contracts' => [],
                'summary' => [
                    'total_amount' => 0,
                    'total_paid' => 0,
                    'total_unpaid' => 0,
                    'contracts_count' => 0,
                ],
                'error' => 'An error occurred while generating the report.'
            ];
        }
    }

    /**
     * Format contracts for the report
     *
     * @param \Illuminate\Support\Collection $contracts
     * @return array
     */
    protected function formatContracts($contracts): array
    {
        return $contracts->map(function ($contract) {
            $documentCreation = $contract->documentCreation;
            
            // Get all lands from the document creation
            $lands = [];
            if ($documentCreation && $documentCreation->lands->isNotEmpty()) {
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
            
            // Get sellers data (max 2 sellers)
            $sellers = [];
            if ($documentCreation && $documentCreation->sellers->isNotEmpty()) {
                $sellers = $documentCreation->sellers->take(2)->map(function ($documentSeller) {
                    $seller = $documentSeller->seller;
                    return [
                        'id' => $seller->id,
                        'name' => $seller->name ?? 'N/A'
                    ];
                })->toArray();
            }
            
            // Calculate payment amounts
            $totalAmount = $contract->paymentSteps->sum('amount');
            $paidAmount = $contract->paymentSteps->where('status', 'paid')->sum('amount');
            $unpaidAmount = $totalAmount - $paidAmount;
            
            return [
                'id' => $contract->id,
                'contract_id' => $contract->contract_id ?? 'N/A',
                'land_plot_number' => $landPlotNumber,
                'lands' => $lands,
                'sellers' => $sellers,
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'unpaid_amount' => $unpaidAmount,
                'payment_steps_count' => $contract->paymentSteps->count(),
                'paid_steps_count' => $contract->paymentSteps->where('status', 'paid')->count(),
                'unpaid_steps_count' => $contract->paymentSteps->whereIn('status', ['pending', 'overdue'])->count(),
            ];
        })->toArray();
    }
}
