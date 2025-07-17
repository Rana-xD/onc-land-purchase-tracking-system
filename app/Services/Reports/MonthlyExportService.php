<?php

namespace App\Services\Reports;

use App\Exports\MonthlyReportExport;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use PDF;

class MonthlyExportService
{
    /**
     * Export monthly report data to PDF or Excel
     *
     * @param array $data
     * @param string $format
     * @param string $startDate
     * @param string $endDate
     * @param User $user
     * @return mixed
     */
    public function exportMonthlyReport(array $data, string $format, string $startDate, string $endDate, User $user)
    {
        // Format dates for filename
        $startFormatted = date('Ymd', strtotime($startDate));
        $endFormatted = date('Ymd', strtotime($endDate));
        $filename = "monthly_report_{$startFormatted}_to_{$endFormatted}";
        
        // Add export metadata
        $data['exported_by'] = $user->name;
        $data['exported_at'] = now()->format('Y-m-d H:i:s');
        
        // Export based on format
        if ($format === 'pdf') {
            return $this->exportToPdf($data, $filename);
        } else {
            return $this->exportToExcel($data, $filename);
        }
    }
    
    /**
     * Export monthly report data to PDF
     *
     * @param array $data
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportToPdf(array $data, string $filename)
    {
        // Generate PDF
        $pdf = PDF::loadView('reports.monthly_report_pdf', $data);
        
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
        
        // Return download response
        return $pdf->download($filename . '.pdf');
    }
    
    /**
     * Export monthly report data to Excel
     *
     * @param array $data
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportToExcel(array $data, string $filename)
    {
        // Create Excel export and return download response
        return Excel::download(new MonthlyReportExport($data), $filename . '.xlsx');
    }
}
