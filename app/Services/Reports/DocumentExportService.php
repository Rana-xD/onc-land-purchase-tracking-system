<?php

namespace App\Services\Reports;

use App\Models\SaleContract;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ContractExport;
use PDF;

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
        
        // Prepare data for export
        $data = [
            'contract' => [
                'id' => $contract->contract_id,
                'date' => $contract->contract_date->format('Y-m-d'),
                'status' => $contract->status,
                'total_amount' => $contract->total_amount,
            ],
            'buyer' => [
                'name' => $contract->buyer_name,
                'phone' => $contract->buyer_phone,
                'address' => $contract->buyer_address,
            ],
            'seller' => [
                'name' => $contract->seller_name,
                'phone' => $contract->seller_phone,
                'address' => $contract->seller_address,
            ],
            'land' => [
                'id' => $contract->land->id,
                'plot_number' => $contract->land->plot_number ?? 'N/A',
                'size' => $contract->land->size ?? 'N/A',
                'location' => $contract->land->location ?? 'N/A',
            ],
            'payment_steps' => $paymentSteps->map(function ($step) {
                return [
                    'step_number' => $step->step_number,
                    'description' => $step->payment_time_description,
                    'amount' => $step->amount,
                    'due_date' => $step->due_date->format('Y-m-d'),
                    'status' => $step->status,
                    'payment_contract_created' => $step->payment_contract_created,
                    'documents' => $step->documents->map(function ($doc) {
                        return [
                            'type' => $doc->document_type,
                            'name' => $doc->file_name,
                            'uploaded_at' => $doc->uploaded_at->format('Y-m-d H:i:s'),
                        ];
                    }),
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
        // Generate PDF
        $pdf = PDF::loadView('reports.contract_export_pdf', $data);
        
        // Set PDF options for Khmer font support
        $pdf->setOptions([
            'font_path' => base_path('resources/fonts/'),
            'font_data' => [
                'koh-santepheap' => [
                    'R' => 'KohSantepheap-Regular.ttf',
                    'B' => 'KohSantepheap-Bold.ttf',
                ],
            ],
            'default_font' => 'koh-santepheap',
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
