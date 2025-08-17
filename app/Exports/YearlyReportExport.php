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

class YearlyReportExport implements FromArray, WithTitle, WithStyles, ShouldAutoSize, WithColumnWidths
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
        $data[] = ['កម្ពុជាការតាមដានដី - របាយការណ៍ប្រចំំ ' . ($this->data['year'] ?? date('Y')), '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        
        // Summary Section
        $data[] = ['📊 សង្ខេបប្រចំំ', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['សញ្ញាសរុប:', $this->data['summary']['contracts_count'] ?? 0, '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['ចំនួនសរុប:', '$' . number_format($this->data['summary']['total_amount'] ?? 0, 2), '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['ចំនួនបានទូទាត់:', '$' . number_format($this->data['summary']['paid_amount'] ?? 0, 2), '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['ចំនួនមិនទានទូទាត់:', '$' . number_format($this->data['summary']['unpaid_amount'] ?? 0, 2), '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['ដីសរុប:', $this->data['summary']['lands_count'] ?? 0, '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        
        // Monthly Contract Breakdown - Header
        $data[] = ['📅 ការបញ្ចាក់សញ្ញាប្រចំខែ', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        
        // Create month headers row (01/25, 02/25, etc.) - these will be merged
        $monthHeaderRow = ['លេខកិច្ចសន្យា', 'លេខក្បាលដីធ្លី', 'អ្នកលក់ទី១', 'អ្នកលក់ទី២'];
        for ($month = 1; $month <= 12; $month++) {
            $monthHeaderRow[] = sprintf('%02d/25', $month); // 01/25, 02/25, etc.
            $monthHeaderRow[] = ''; // Empty cell for merging
        }
        $data[] = $monthHeaderRow;
        
        // Create sub-headers row (Paid, Unpaid under each month)
        $subHeaders = ['', '', '', '']; // Empty for Contract ID, Plot Number, and Seller columns
        for ($month = 1; $month <= 12; $month++) {
            $subHeaders[] = 'បានទូទាត់';
            $subHeaders[] = 'មិនទានទូទាត់';
        }
        $data[] = $subHeaders;
        
        // Contract data with monthly breakdown
        if (isset($this->data['contracts']) && count($this->data['contracts']) > 0) {
            foreach ($this->data['contracts'] as $contract) {
                // Get first land plot number
                $plotNumber = 'N/A';
                
                if (!empty($contract['lands'])) {
                    $plotNumber = $contract['lands'][0]['plot_number'] ?? 'N/A';
                }
                
                // Get seller information (max 2 sellers)
                $seller1 = isset($contract['sellers'][0]) ? $contract['sellers'][0]['name'] : 'N/A';
                $seller2 = isset($contract['sellers'][1]) ? $contract['sellers'][1]['name'] : 'N/A';
                
                $row = [
                    $contract['contract_id'] ?? 'N/A',
                    $plotNumber,
                    $seller1,
                    $seller2
                ];
                
                // Add monthly data (paid/unpaid for each month)
                for ($month = 1; $month <= 12; $month++) {
                    $monthData = $contract['monthly_data'][$month] ?? ['paid' => 0, 'unpaid' => 0];
                    $row[] = $monthData['paid'] > 0 ? '$' . number_format($monthData['paid'], 2) : '$0';
                    $row[] = $monthData['unpaid'] > 0 ? '$' . number_format($monthData['unpaid'], 2) : '$0';
                }
                
                $data[] = $row;
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
            'B' => 12,  // Plot Number
            'C' => 18,  // Seller 1
            'D' => 18,  // Seller 2
            'E' => 12,  // Jan Paid
            'F' => 12,  // Jan Unpaid
            'G' => 12,  // Feb Paid
            'H' => 12,  // Feb Unpaid
            'I' => 12,  // Mar Paid
            'J' => 12,  // Mar Unpaid
            'K' => 12,  // Apr Paid
            'L' => 12,  // Apr Unpaid
            'M' => 12,  // May Paid
            'N' => 12,  // May Unpaid
            'O' => 12,  // Jun Paid
            'P' => 12,  // Jun Unpaid
            'Q' => 12,  // Jul Paid
            'R' => 12,  // Jul Unpaid
            'S' => 12,  // Aug Paid
            'T' => 12,  // Aug Unpaid
            'U' => 12,  // Sep Paid
            'V' => 12,  // Sep Unpaid
            'W' => 12,  // Oct Paid
            'X' => 12,  // Oct Unpaid
            'Y' => 12,  // Nov Paid
            'Z' => 12,  // Nov Unpaid
            'AA' => 12, // Dec Paid
            'AB' => 12, // Dec Unpaid
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Yearly Report ' . $this->data['year'];
    }

    /**
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();
        
        // Title styling - Increased font size by 60% for Khmer readability
        $sheet->mergeCells('A1:Z1');
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
        
        // Merge month headers (01/25, 02/25, etc.)
        for ($row = 1; $row <= $lastRow; $row++) {
            $cellValue = $sheet->getCell('C' . $row)->getValue();
            
            // Check if this is a month header row (01/25, 02/25, etc.)
            if ($cellValue !== null && preg_match('/^\d{2}\/25$/', $cellValue)) {
                // Merge each month header with its adjacent empty cell
                $startCol = 'C';
                for ($month = 1; $month <= 12; $month++) {
                    $colIndex = ord($startCol) + (($month - 1) * 2);
                    $col1 = chr($colIndex);
                    $col2 = chr($colIndex + 1);
                    
                    $sheet->mergeCells($col1 . $row . ':' . $col2 . $row);
                    $sheet->getStyle($col1 . $row)->applyFromArray([
                        'font' => [
                            'bold' => true,
                            'size' => 25, // Increased from 18 to 25 (additional 40% increase)
                            'color' => ['rgb' => 'FFFFFF']
                        ],
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => '5B9BD5']
                        ],
                        'alignment' => [
                            'horizontal' => Alignment::HORIZONTAL_CENTER,
                            'vertical' => Alignment::VERTICAL_CENTER
                        ]
                    ]);
                }
                break; // Only process the first month header row
            }
        }
        
        // Apply styling for each row
        for ($row = 1; $row <= $lastRow; $row++) {
            $cellValue = $sheet->getCell('A' . $row)->getValue();
            
            // Section headers
            if ($cellValue !== null && (strpos($cellValue, '📊') !== false || 
                strpos($cellValue, '📅') !== false || 
                strpos($cellValue, '📋') !== false)) {
                
                $sheet->mergeCells('A' . $row . ':Z' . $row);
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
            
            // Table headers (Contract ID, Plot Number) and sub-headers (Paid, Unpaid)
            if (in_array($cellValue, ['Contract ID', 'Plot Number']) || $cellValue === 'Paid') {
                $sheet->getStyle('A' . $row . ':Z' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 25, // Increased from 11 to 25 (additional 40% increase)
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
            if (in_array($cellValue, ['សញ្ញាសរុប:', 'ចំនួនសរុប:', 'ចំនួនបានទូទាត់:', 'ចំនួនមិនទានទូទាត់:', 'ដីសរុប:', 'និរ្យាតដោយ:', 'កាលបរិច្ឆេទនិរ្យាត:'])) {
                $sheet->getStyle('A' . $row . ':B' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 25 // Increased from 18 to 25 (additional 40% increase)
                    ]
                ]);
                
                // Color coding for financial summaries
                if (strpos($cellValue, 'ចំនួនបានទូទាត់:') !== false) {
                    $sheet->getStyle('B' . $row)->applyFromArray([
                        'font' => ['color' => ['rgb' => '28A745']]
                    ]);
                } elseif (strpos($cellValue, 'ចំនួនមិនទានទូទាត់:') !== false) {
                    $sheet->getStyle('B' . $row)->applyFromArray([
                        'font' => ['color' => ['rgb' => 'DC3545']]
                    ]);
                }
            }
            
            // Alternate row coloring for data tables
            if ($row > 1 && !empty($cellValue) && 
                !strpos($cellValue, '📊') && !strpos($cellValue, '📅') && !strpos($cellValue, '📋') &&
                !in_array($cellValue, ['Contract ID', 'Plot Number', 'Paid', 'Total Contracts:', 'Total Amount:', 'Total Paid:', 'Total Unpaid:', 'Total Lands:', 'Exported By:', 'Export Date:']) &&
                !preg_match('/^\d{2}\/25$/', $cellValue) &&
                $cellValue !== '') {
                
                if ($row % 2 == 0) {
                    $sheet->getStyle('A' . $row . ':Z' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'F8F9FA']
                        ]
                    ]);
                }
            }
        }
        
        // Apply general font size increase to all data rows for Khmer readability
        $sheet->getStyle('A4:Z' . $lastRow)->applyFromArray([
            'font' => [
                'size' => 22 // Increased from 16 to 22 (additional 40% increase) for general data
            ]
        ]);
        
        // Apply borders to all data
        $sheet->getStyle('A1:Z' . $lastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'D0D0D0']
                ]
            ]
        ]);
        
        // Add special styling for monthly columns (paid amounts in green, unpaid in red)
        for ($row = 1; $row <= $lastRow; $row++) {
            $contractId = $sheet->getCell('A' . $row)->getValue();
            
            // Skip header rows and empty rows
            if (empty($contractId) || strpos($contractId, '📊') !== false || 
                strpos($contractId, '📅') !== false || strpos($contractId, '📋') !== false ||
                $contractId === 'Contract ID' || preg_match('/^\d{2}\/25$/', $contractId)) {
                continue;
            }
            
            // Style monthly data columns (C to Z)
            for ($col = 'C'; $col <= 'Z'; $col++) {
                $cellValue = $sheet->getCell($col . $row)->getValue();
                
                // Skip if empty or $0
                if (empty($cellValue) || $cellValue === '$0') {
                    continue;
                }
                
                // Get column index to determine if it's paid or unpaid
                $colIndex = ord($col) - ord('A');
                
                // Columns C,E,G,I,K,M,O,Q,S,U,W,Y (even indices starting from 2) are paid amounts
                // Columns D,F,H,J,L,N,P,R,T,V,X,Z (odd indices starting from 3) are unpaid amounts
                if (($colIndex - 2) % 2 === 0) {
                    // Paid amount - green background
                    $sheet->getStyle($col . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'E8F5E8']
                        ],
                        'font' => ['color' => ['rgb' => '2E7D32']]
                    ]);
                } else {
                    // Unpaid amount - red background
                    $sheet->getStyle($col . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'FFEBEE']
                        ],
                        'font' => ['color' => ['rgb' => 'C62828']]
                    ]);
                }
            }
        }
        
        return [];
    }
}
