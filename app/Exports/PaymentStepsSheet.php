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
use Illuminate\Support\Collection;

class PaymentStepsSheet implements FromArray, WithTitle, WithStyles, ShouldAutoSize, WithColumnWidths
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
        $data[] = ['💰 កំណែទឹកការទូទាត់', '', '', '', '', '', ''];
        $data[] = ['', '', '', '', '', '', ''];
        
        // Header row
        $data[] = [
            'ជំហាន #',
            'ការពិពណ៌នា',
            'ចំនួនទឹកប្រាក់',
            'កាលបរិច្ឆេទកំណត់',
            'ស្ថានភាព',
            'បានបង្កើតសញ្ញា'
        ];
        
        // Payment steps data
        // Convert Collection to array if needed for consistent handling
        $paymentStepsData = is_array($this->data['payment_steps']) ? $this->data['payment_steps'] : $this->data['payment_steps']->toArray();
        
        foreach ($paymentStepsData as $step) {
            $data[] = [
                'ជំហាន ' . $step['step_number'],
                $step['description'],
                '$' . number_format($step['amount'], 2),
                $step['due_date'],
                ucfirst($step['status']),
                $step['payment_contract_created'] ? '✅ បាន' : '❌ មិនបាន'
            ];
        }
        
        // Summary section
        $data[] = ['', '', '', '', '', ''];
        $data[] = ['📊 សង្ខេបការទូទាត់', '', '', '', '', ''];
        
        // Convert Collection to array if needed
        $paymentStepsArray = is_array($this->data['payment_steps']) ? $this->data['payment_steps'] : $this->data['payment_steps']->toArray();
        
        $totalAmount = array_sum(array_column($paymentStepsArray, 'amount'));
        $paidSteps = array_filter($paymentStepsArray, function($step) {
            return $step['status'] === 'paid';
        });
        $paidAmount = array_sum(array_column($paidSteps, 'amount'));
        $remainingAmount = $totalAmount - $paidAmount;
        
        $data[] = ['ចំនួនសរុប:', '$' . number_format($totalAmount, 2), '', '', '', ''];
        $data[] = ['ចំនួនបានទូទាត់:', '$' . number_format($paidAmount, 2), '', '', '', ''];
        $data[] = ['ចំនួននៅសល់:', '$' . number_format($remainingAmount, 2), '', '', '', ''];
        $data[] = ['ជំហានសរុប:', count($this->data['payment_steps']), '', '', '', ''];
        $data[] = ['ជំហានបានបញ្ជប់:', count($paidSteps), '', '', '', ''];
        
        return $data;
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 12,
            'B' => 30,
            'C' => 15,
            'D' => 15,
            'E' => 15,
            'F' => 18,
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Payment Schedule';
    }

    /**
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();
        
        // Title styling - Increased font size by 60% for Khmer readability
        $sheet->mergeCells('A1:F1');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 26, // Increased from 16 to 26 (60% increase)
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
        
        // Header row styling (row 3) - Increased font size by 60% for Khmer readability
        $sheet->getStyle('A3:F3')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 27, // Increased from 19 to 27 (additional 40% increase)
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ]);
        
        // Apply conditional formatting and styling for data rows
        for ($row = 4; $row <= $lastRow; $row++) {
            $cellValue = $sheet->getCell('A' . $row)->getValue();
            $status = $sheet->getCell('E' . $row)->getValue();
            
            // Payment step rows
            if ($cellValue !== null && strpos($cellValue, 'ជំហាន') === 0) {
                // Status-based coloring
                if ($status !== null && strtolower($status) === 'paid') {
                    $sheet->getStyle('A' . $row . ':F' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'D5EDDA']
                        ]
                    ]);
                } elseif ($status !== null && strtolower($status) === 'overdue') {
                    $sheet->getStyle('A' . $row . ':F' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'F8D7DA']
                        ],
                        'font' => [
                            'color' => ['rgb' => '721C24']
                        ]
                    ]);
                } elseif ($status !== null && strtolower($status) === 'pending') {
                    $sheet->getStyle('A' . $row . ':F' . $row)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'FFF3CD']
                        ]
                    ]);
                }
                
                // Bold step rows with increased font size for Khmer readability
                $sheet->getStyle('A' . $row . ':F' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 25 // Increased from 18 to 25 (additional 40% increase)
                    ]
                ]);
            }
            
            // Document rows (indented) - Note: This section is now obsolete since documents are removed
            $bCellValue = $sheet->getCell('B' . $row)->getValue();
            if ($cellValue !== null && strpos($cellValue, '') === 0 && $bCellValue !== null && strpos($bCellValue, '📄') !== false) {
                $sheet->getStyle('A' . $row . ':F' . $row)->applyFromArray([
                    'font' => [
                        'italic' => true,
                        'color' => ['rgb' => '6C757D']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F8F9FA']
                    ]
                ]);
            }
            
            // Summary section headers
            if ($cellValue !== null && strpos($cellValue, '📊') !== false) {
                $sheet->mergeCells('A' . $row . ':F' . $row);
                $sheet->getStyle('A' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 27, // Increased from 19 to 27 (additional 40% increase)
                        'color' => ['rgb' => 'FFFFFF']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '28A745']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                        'vertical' => Alignment::VERTICAL_CENTER
                    ]
                ]);
            }
            
            // Summary data rows
            if (in_array($cellValue, ['ចំនួនសរុប:', 'ចំនួនបានទូទាត់:', 'ចំនួននៅសល់:', 'ជំហានសរុប:', 'ជំហានបានបញ្ជប់:'])) {
                $sheet->getStyle('A' . $row . ':B' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 25 // Increased from 18 to 25 (additional 40% increase)
                    ]
                ]);
            }
        }
        
        // Apply general font size increase to all data rows for Khmer readability
        $sheet->getStyle('A4:F' . $lastRow)->applyFromArray([
            'font' => [
                'size' => 22 // Increased from 16 to 22 (additional 40% increase) for general data
            ]
        ]);
        
        // Apply borders to all data
        $sheet->getStyle('A1:F' . $lastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'D0D0D0']
                ]
            ]
        ]);
        
        return [];
    }
}
