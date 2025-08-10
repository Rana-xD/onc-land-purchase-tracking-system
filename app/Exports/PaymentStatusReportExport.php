<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;

class PaymentStatusReportExport implements FromArray, WithTitle, WithStyles, ShouldAutoSize, WithColumnWidths
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
        
        // Title row
        $data[] = ['កម្ពុជាការតាមដានដី - របាយការណ៍ស្ថានភាពទូទាត់', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', ''];
        
        // Summary Section
        $data[] = ['📊 សង្ខេបការទូទាត់', '', '', '', '', '', ''];
        $data[] = ['កិច្ចសន្យាសរុប:', $this->data['summary']['contracts_count'] ?? 0, '', '', '', '', ''];
        $data[] = ['ចំនួនសរុប:', '$' . number_format($this->data['summary']['total_amount'] ?? 0, 2), '', '', '', '', ''];
        $data[] = ['ចំនួនបានទូទាត់:', '$' . number_format($this->data['summary']['total_paid'] ?? 0, 2), '', '', '', '', ''];
        $data[] = ['ចំនួនមិនទានទូទាត់:', '$' . number_format($this->data['summary']['total_unpaid'] ?? 0, 2), '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', ''];
        
        // Contract Details Section
        $data[] = ['📋 ស្ថានភាពទូទាត់', '', '', '', ''];
        $data[] = ['លេខកិច្ចសន្យា', 'លេខដីធ្លី', 'ចំនួនសរុប', 'ចំនួនបានទូទាត់', 'ចំនួនមិនទានទូទាត់'];
        
        if (isset($this->data['contracts']) && count($this->data['contracts']) > 0) {
            foreach ($this->data['contracts'] as $contract) {
                $data[] = [
                    $contract['contract_id'] ?? 'N/A',
                    $contract['land_plot_number'] ?? 'N/A',
                    '$' . number_format($contract['total_amount'] ?? 0, 2),
                    '$' . number_format($contract['paid_amount'] ?? 0, 2),
                    '$' . number_format($contract['unpaid_amount'] ?? 0, 2),
                ];
            }
        }
        
        return $data;
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 15,  // Contract ID
            'B' => 15,  // Plot Number
            'C' => 18,  // Total Amount
            'D' => 18,  // Paid Amount
            'E' => 18,  // Unpaid Amount
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Payment Status Report';
    }

    /**
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();
        
        // Title styling - Increased font size by 60% for Khmer readability
        $sheet->mergeCells('A1:E1');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 36, // Increased from 26 to 36 (additional 40% increase)
                'color' => ['rgb' => '2E5984']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E8F4FD']
            ]
        ]);
        
        // Apply styling for each row
        for ($row = 1; $row <= $lastRow; $row++) {
            $cellValue = $sheet->getCell('A' . $row)->getValue();
            
            // Section headers
            if (strpos($cellValue ?? '', '📊') !== false || 
                strpos($cellValue ?? '', '📋') !== false) {
                
                $sheet->mergeCells('A' . $row . ':E' . $row);
                $sheet->getStyle('A' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 27, // Increased from 12 to 27 (additional 40% increase)
                        'color' => ['rgb' => 'FFFFFF']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '4472C4']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                        'vertical' => Alignment::VERTICAL_CENTER
                    ]
                ]);
            }
            
            // Table headers
            if ($cellValue === 'លេខកិច្ចសន្យា') {
                $sheet->getStyle('A' . $row . ':E' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 25, // Increased from 18 to 25 (additional 40% increase)
                        'color' => ['rgb' => 'FFFFFF']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '70AD47']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER
                    ]
                ]);
            }
            
            // Summary data rows
            if (in_array($cellValue, ['Total Contracts:', 'Total Amount:', 'Total Paid:', 'Total Unpaid:'])) {
                $sheet->getStyle('A' . $row . ':B' . $row)->applyFromArray([
                    'font' => ['bold' => true]
                ]);
                
                // Color coding for financial summaries
                if (strpos($cellValue ?? '', 'Total Paid:') !== false) {
                    $sheet->getStyle('B' . $row)->applyFromArray([
                        'font' => ['color' => ['rgb' => '28A745']]
                    ]);
                } elseif (strpos($cellValue ?? '', 'Total Unpaid:') !== false) {
                    $sheet->getStyle('B' . $row)->applyFromArray([
                        'font' => ['color' => ['rgb' => 'DC3545']]
                    ]);
                }
            }
            
            // Alternate row coloring for data tables
            if ($row > 1 && !empty($cellValue) && 
                strpos($cellValue ?? '', '📊') === false && strpos($cellValue ?? '', '📋') === false &&
                !in_array($cellValue, ['Contract ID', 'Total Contracts:', 'Total Amount:', 'Total Paid:', 'Total Unpaid:']) &&
                $cellValue !== '') {
                
                if ($row % 2 == 0) {
                    $sheet->getStyle('A' . $row . ':E' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'F8F9FA']
                        ]
                    ]);
                }
            }
        }
        
        // Apply general font size increase to all data rows for Khmer readability
        $sheet->getStyle('A3:E' . $lastRow)->applyFromArray([
            'font' => [
                'size' => 22 // Increased from 16 to 22 (additional 40% increase) for general data
            ]
        ]);
        
        // Apply borders to all data
        $sheet->getStyle('A1:E' . $lastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'D0D0D0']
                ]
            ]
        ]);
        
        // Color code amounts in the contract data
        for ($row = 1; $row <= $lastRow; $row++) {
            $contractId = $sheet->getCell('A' . $row)->getValue();
            
            // Skip header rows and empty rows
            if (empty($contractId) || strpos($contractId ?? '', '📊') !== false || 
                strpos($contractId ?? '', '📋') !== false || $contractId === 'Contract ID') {
                continue;
            }
            
            // Color code paid amounts (green) and unpaid amounts (red)
            $paidAmount = $sheet->getCell('D' . $row)->getValue();
            $unpaidAmount = $sheet->getCell('E' . $row)->getValue();
            
            if (!empty($paidAmount) && $paidAmount !== '$0.00') {
                $sheet->getStyle('D' . $row)->applyFromArray([
                    'font' => ['color' => ['rgb' => '2E7D32']]
                ]);
            }
            
            if (!empty($unpaidAmount) && $unpaidAmount !== '$0.00') {
                $sheet->getStyle('E' . $row)->applyFromArray([
                    'font' => ['color' => ['rgb' => 'C62828']]
                ]);
            }
        }
        
        return [];
    }
}
