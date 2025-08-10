<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class MonthlyReportExport implements FromArray, WithTitle, WithStyles, WithColumnWidths
{
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function array(): array
    {
        $data = [];
        
        // Header section
        $data[] = ['📊 MONTHLY PAYMENT REPORT', '', '', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', '', '', ''];
        
        // Summary section
        $data[] = ['📈 SUMMARY', '', '', '', '', '', '', '', ''];
        $data[] = ['Total Amount:', '$' . number_format($this->data['summary']['total_amount'], 2), '', '', '', '', '', '', ''];
        $data[] = ['Payment Steps:', $this->data['summary']['payment_steps_count'], '', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', '', '', ''];
        
        // Payment details header
        $data[] = ['💰 ព័ត៌មានការទូទាត់', '', '', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', '', '', ''];
        
        // Table headers
        $data[] = [
            'លេខកុងត្រា',
            'លេខក្បាលដី',
            'អ្នកទិញ',
            'អ្នកលក់',
            'ជំហាន',
            'ការពិពណ៌នា', 
            'ចំនួនទឹកប្រាក់',
            'កាលបរិច្ឆេទកំណត់',
            'ស្ថានភាព',
          
        ];
        
        // Payment data
        foreach ($this->data['payments'] as $payment) {
            $data[] = [
                $payment['contract_id'] ?? 'N/A',
                $payment['land_plot_number'] ?? 'N/A', // Correct field name
                $payment['buyer_names'] ?? 'N/A', // Correct field name
                $payment['seller_names'] ?? 'N/A', // Correct field name
                'ជំហាន ' . ($payment['step_number'] ?? 'N/A'),
                $payment['payment_time_description'] ?? 'N/A', // Correct field name
                '$' . number_format($payment['amount'] ?? 0, 2),
                $payment['due_date'] ?? 'N/A',
                ucfirst($payment['status'] ?? 'unknown'),
            ];
        }
        
        return $data;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Monthly Report';
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 15,
            'B' => 10,
            'C' => 25,
            'D' => 15,
            'E' => 12,
            'F' => 12,
            'G' => 20,
            'H' => 20,
            'I' => 15,
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();
        
        // Title styling - Increased font size by 60% for Khmer readability
        $sheet->mergeCells('A1:I1');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 36, 'color' => ['rgb' => '2E75B6']], // Increased from 26 to 36 (additional 40% increase)
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);
        
        // Section headers styling
        foreach (range(3, $lastRow) as $row) {
            $cellValue = $sheet->getCell('A' . $row)->getValue();
            if (strpos($cellValue, '📅') !== false || strpos($cellValue, '📈') !== false || strpos($cellValue, '💰') !== false) {
                $sheet->mergeCells('A' . $row . ':I' . $row);
                $sheet->getStyle('A' . $row)->applyFromArray([
                    'font' => ['bold' => true, 'size' => 27, 'color' => ['rgb' => '2E75B6']], // Increased from 19 to 27 (additional 40% increase)
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E7F3FF']]
                ]);
            }
        }
        
        // Table header styling
        $headerRow = null;
        for ($row = 1; $row <= $lastRow; $row++) {
            if ($sheet->getCell('A' . $row)->getValue() === 'Contract ID') {
                $headerRow = $row;
                break;
            }
        }
        
        if ($headerRow) {
            $sheet->getStyle('A' . $headerRow . ':I' . $headerRow)->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2E75B6']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]
            ]);
            
            // Data rows styling with alternating colors and status-based coloring
            for ($row = $headerRow + 1; $row <= $lastRow; $row++) {
                $status = $sheet->getCell('F' . $row)->getValue();
                
                // Base alternating row color
                $fillColor = ($row % 2 == 0) ? 'F8F9FA' : 'FFFFFF';
                
                // Status-based coloring
                if (strpos(strtolower($status), 'paid') !== false) {
                    $fillColor = 'E8F5E8'; // Light green for paid
                } elseif (strpos(strtolower($status), 'overdue') !== false) {
                    $fillColor = 'FFEBEE'; // Light red for overdue
                }
                
                $sheet->getStyle('A' . $row . ':I' . $row)->applyFromArray([
                    'font' => ['size' => 22], // Increased from 16 to 22 (additional 40% increase) for Khmer readability
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $fillColor]],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E0E0E0']]]
                ]);
            }
        }
        
        return [];
    }
}
