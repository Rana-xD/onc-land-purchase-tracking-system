<?php

namespace App\Services\Reports;

use App\Exports\YearlyReportExport;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use PDF;

class YearlyExportService
{
    /**
     * Export yearly report data to PDF or Excel
     *
     * @param array $data
     * @param string $format
     * @param int $year
     * @param User $user
     * @return mixed
     */
    public function exportYearlyReport(array $data, string $format, int $year, User $user)
    {
        $filename = "yearly_report_{$year}";
        
        // Add export metadata
        $data['exported_by'] = $user->name;
        $data['exported_at'] = now()->format('Y-m-d H:i:s');
        $data['year'] = $year;
        
        // Export based on format
        if ($format === 'pdf') {
            return $this->exportToPdf($data, $filename);
        } else {
            return $this->exportToExcel($data, $filename);
        }
    }
    
    /**
     * Export yearly report data to PDF
     *
     * @param array $data
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportToPdf(array $data, string $filename)
    {
        // Generate PDF
        $pdf = PDF::loadView('reports.yearly_report_pdf', $data);
        
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
     * Export yearly report data to Excel
     *
     * @param array $data
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    protected function exportToExcel(array $data, string $filename)
    {
        // Create Excel export and return download response
        return Excel::download(new YearlyReportExport($data), $filename . '.xlsx');
    }
}
