<?php

namespace App\Services\Reports;

use App\Exports\PaymentStatusReportExport;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\FontService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class PaymentStatusExportService
{
    /**
     * Export payment status report to PDF or Excel
     *
     * @param array $data Report data
     * @param string $format Format (pdf or excel)
     * @param \App\Models\User $user Current user
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportPaymentStatusReport(array $data, string $format, $user)
    {
        try {
            // Add export metadata
            $data['exported_by'] = $user->name ?? 'System';
            $data['exported_at'] = date('Y-m-d H:i:s');
            
            $filename = 'payment_status_report_' . date('Y-m-d');
            
            if ($format === 'excel') {
                // Export to Excel
                $filename .= '.xlsx';
                
                return Excel::download(
                    new PaymentStatusReportExport($data),
                    $filename,
                    \Maatwebsite\Excel\Excel::XLSX
                );
            } elseif ($format === 'pdf') {
                // Export to PDF
                $filename .= '.pdf';
                
                // Register Khmer fonts
                FontService::registerKhmerFonts();
                
                // Generate PDF with proper Khmer font support
                $pdf = Pdf::loadView('reports.payment-status-pdf', $data);
                $pdf->getDomPDF()->setOptions(FontService::getDomPdfOptions());
                return $pdf->download($filename);
            }
            
            throw new \Exception('Unsupported export format: ' . $format);
            
        } catch (\Exception $e) {
            Log::error('Payment Status Export Error: ' . $e->getMessage(), [
                'format' => $format,
                'user_id' => $user->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
}
