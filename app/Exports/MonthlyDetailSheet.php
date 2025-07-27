<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Illuminate\Support\Collection;
use Carbon\Carbon;

class MonthlyDetailSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
{
    protected $month;
    protected $monthData;

    public function __construct(string $month, array $monthData)
    {
        $this->month = $month;
        $this->monthData = $monthData;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return collect($this->monthData['payment_steps']);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Contract ID',
            'Step',
            'Description',
            'Amount',
            'Due Date',
            'Status',
            'Buyer',
            'Seller',
            'Land Plot',
            'Location',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row['contract_id'],
            $row['step_number'],
            $row['payment_description'],
            '$' . number_format($row['amount'], 2),
            $row['due_date'],
            ucfirst($row['status']),
            $row['buyer_name'],
            $row['seller_name'],
            $row['land_info']['plot_number'],
            $row['land_info']['location'],
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return Carbon::parse($this->month . '-01')->format('F Y');
    }

    /**
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        // Apply styles to the header row
        $sheet->getStyle('A1:J1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 27,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'rgb' => 'E2EFDA',
                ],
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);
        
        // Apply conditional formatting for payment statuses
        $lastRow = $sheet->getHighestRow();
        
        for ($row = 2; $row <= $lastRow; $row++) {
            $status = $sheet->getCell('F' . $row)->getValue();
            
            if ($status === 'Overdue') {
                $sheet->getStyle('F' . $row)->applyFromArray([
                    'font' => [
                        'color' => [
                            'rgb' => 'FF0000',
                        ],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => [
                            'rgb' => 'FFCCCC',
                        ],
                    ],
                ]);
            } elseif ($status === 'Paid') {
                $sheet->getStyle('F' . $row)->applyFromArray([
                    'font' => [
                        'color' => [
                            'rgb' => '008000',
                        ],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => [
                            'rgb' => 'E2EFDA',
                        ],
                    ],
                ]);
            } elseif ($status === 'Contract_created') {
                $sheet->getStyle('F' . $row)->applyFromArray([
                    'font' => [
                        'color' => [
                            'rgb' => '0000FF',
                        ],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => [
                            'rgb' => 'E6F0FF',
                        ],
                    ],
                ]);
            }
        }
        
        // Add a summary at the bottom
        $summaryRow = $lastRow + 2;
        $sheet->setCellValue('A' . $summaryRow, 'Month Summary');
        $sheet->setCellValue('B' . $summaryRow, 'Total Amount:');
        $sheet->setCellValue('C' . $summaryRow, '$' . number_format($this->monthData['total_amount'], 2));
        
        $sheet->setCellValue('A' . ($summaryRow + 1), '');
        $sheet->setCellValue('B' . ($summaryRow + 1), 'Total Paid:');
        $sheet->setCellValue('C' . ($summaryRow + 1), '$' . number_format($this->monthData['total_paid'], 2));
        
        $sheet->setCellValue('A' . ($summaryRow + 2), '');
        $sheet->setCellValue('B' . ($summaryRow + 2), 'Total Overdue:');
        $sheet->setCellValue('C' . ($summaryRow + 2), '$' . number_format($this->monthData['total_overdue'], 2));
        
        $sheet->setCellValue('A' . ($summaryRow + 3), '');
        $sheet->setCellValue('B' . ($summaryRow + 3), 'Total Pending:');
        $sheet->setCellValue('C' . ($summaryRow + 3), '$' . number_format($this->monthData['total_pending'], 2));
        
        // Style the summary
        $sheet->getStyle('A' . $summaryRow . ':C' . ($summaryRow + 3))->applyFromArray([
            'font' => [
                'bold' => true,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'rgb' => 'F2F2F2',
                ],
            ],
            'borders' => [
                'outline' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);
        
        return [];
    }
}
