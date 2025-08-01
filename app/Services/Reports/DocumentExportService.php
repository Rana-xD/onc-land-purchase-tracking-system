<?php

namespace App\Services\Reports;

use App\Models\SaleContract;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ContractExport;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentExportService
{
    /**
     * Export contract data to PDF or Excel
     *
     * @param SaleContract $contract
     * @param string $format
     * @param User $user
     * @return mixed
     */
    public function exportContract(SaleContract $contract, string $format, User $user)
    {
        // Get payment steps and documents
        $paymentSteps = $contract->documentCreation->paymentSteps;
        
        // Get all lands associated with this contract through document_creation
        $documentLands = $contract->documentCreation->lands()->with('land')->get();
        
        // Get all buyers associated with this contract through document_creation
        $documentBuyers = $contract->documentCreation->buyers()->with('buyer')->get();
        
        // Get all sellers associated with this contract through document_creation
        $documentSellers = $contract->documentCreation->sellers()->with('seller')->get();
        
        // Prepare data for export
        $data = [
            'contract' => [
                'id' => $contract->contract_id,
                'date' => $contract->contract_date->format('Y-m-d'),
                'status' => $contract->status,
                'total_amount' => $contract->total_amount,
            ],
            // Keep single buyer for backward compatibility
            'buyer' => [
                'name' => $contract->buyer_name,
                'phone' => $contract->buyer_phone,
                'address' => $contract->buyer_address,
            ],
            // Keep single seller for backward compatibility
            'seller' => [
                'name' => $contract->seller_name,
                'phone' => $contract->seller_phone,
                'address' => $contract->seller_address,
            ],
            // Add all buyers
            'buyers' => $documentBuyers->map(function ($documentBuyer) {
                $buyer = $documentBuyer->buyer;
                return [
                    'id' => $buyer->id,
                    'name' => $buyer->name,
                    'phone' => $buyer->phone ?? 'N/A',
                    'address' => $buyer->address ?? 'N/A',
                ];
            }),
            // Add all sellers
            'sellers' => $documentSellers->map(function ($documentSeller) {
                $seller = $documentSeller->seller;
                return [
                    'id' => $seller->id,
                    'name' => $seller->name,
                    'phone' => $seller->phone ?? 'N/A',
                    'address' => $seller->address ?? 'N/A',
                ];
            }),
            'lands' => $documentLands->map(function ($documentLand) {
                $land = $documentLand->land;
                return [
                    'id' => $land->id,
                    'plot_number' => $land->plot_number ?? 'N/A',
                    'size' => $land->size ?? 'N/A',
                    'location' => $land->location ?? 'N/A',
                    'price_per_m2' => $documentLand->price_per_m2 ?? 'N/A',
                    'total_price' => $documentLand->total_price ?? 'N/A',
                ];
            }),
            // Keep the original land relationship for backward compatibility
            'land' => $contract->land ? [
                'id' => $contract->land->id,
                'plot_number' => $contract->land->plot_number ?? 'N/A',
                'size' => $contract->land->size ?? 'N/A',
                'location' => $contract->land->location ?? 'N/A',
            ] : null,
            'payment_steps' => $paymentSteps->map(function ($step) {
                return [
                    'step_number' => $step->step_number,
                    'description' => $step->payment_time_description,
                    'amount' => $step->amount,
                    'due_date' => $step->due_date->format('Y-m-d'),
                    'status' => $step->status,
                    'payment_contract_created' => $step->payment_contract_created,
                    // Note: Documents are now associated with sale contracts, not individual payment steps
                    'documents' => [], // Individual payment steps no longer have documents
                ];
            }),
            // Contract-level documents (associated with the sale contract)
            'contract_documents' => $contract->documents->map(function ($doc) {
                return [
                    'name' => $doc->file_name,
                    'file_path' => $doc->file_path,
                    'file_size' => $doc->file_size,
                    'mime_type' => $doc->mime_type,
                    'uploaded_at' => $doc->uploaded_at ? $doc->uploaded_at->format('Y-m-d H:i:s') : 'N/A',
                    'uploaded_by' => $doc->uploader ? $doc->uploader->name : 'Unknown',
                ];
            }),
            'exported_by' => $user->name,
            'exported_at' => now()->format('Y-m-d H:i:s'),
        ];
        
        // Export based on format
        if ($format === 'pdf') {
            return $this->exportToPdf($contract, $data);
        } else {
            return $this->exportToExcel($contract, $data);
        }
    }
    
    /**
     * Export contract data to PDF
     *
     * @param SaleContract $contract
     * @param array $data
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportToPdf(SaleContract $contract, array $data)
    {
        // Generate PDF with Khmer font support
        $pdf = Pdf::loadView('reports.contract_export_pdf', $data);
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isPhpEnabled' => true,
            'defaultFont' => 'serif',
            'isRemoteEnabled' => true,
            'fontDir' => storage_path('fonts'),
            'fontCache' => storage_path('fonts'),
            'isUnicodeEnabled' => true,
            'isFontSubsettingEnabled' => true,
        ]);
        
        // Generate filename
        $fileName = 'contract_' . $contract->contract_id . '_' . now()->format('Ymd_His') . '.pdf';
        
        // Return download response
        return $pdf->download($fileName);
    }
    
    /**
     * Export contract data to Excel
     *
     * @param SaleContract $contract
     * @param array $data
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportToExcel(SaleContract $contract, array $data)
    {
        // Generate filename
        $fileName = 'contract_' . $contract->contract_id . '_' . now()->format('Ymd_His') . '.xlsx';
        
        // Create Excel export and return download response
        return Excel::download(new ContractExport($data), $fileName);
    }
}
