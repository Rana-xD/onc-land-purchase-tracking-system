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
use Illuminate\Support\Collection;

class PaymentStepsSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
{
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // Return payment steps as a collection
        return collect($this->data['payment_steps']);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Step Number',
            'Description',
            'Amount',
            'Due Date',
            'Status',
            'Contract Created',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row['step_number'],
            $row['description'],
            '$' . number_format($row['amount'], 2),
            $row['due_date'],
            ucfirst($row['status']),
            $row['payment_contract_created'] ? 'Yes' : 'No',
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
        $styleArray = [
            'font' => [
                'bold' => true,
                'size' => 12,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'rgb' => 'E2EFDA',
                ],
            ],
        ];

        // Apply styles to the header row
        $sheet->getStyle('A1:F1')->applyFromArray($styleArray);
        
        // Apply conditional formatting for overdue payments
        $lastRow = $sheet->getHighestRow();
        
        for ($row = 2; $row <= $lastRow; $row++) {
            $status = $sheet->getCell('E' . $row)->getValue();
            
            if ($status === 'Overdue') {
                $sheet->getStyle('A' . $row . ':F' . $row)->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setRGB('FFCCCC');
            }
        }
        
        return [];
    }
}
