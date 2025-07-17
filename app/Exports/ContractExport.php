<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;

class ContractExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize, WithMultipleSheets
{
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [
            new ContractInfoSheet($this->data),
            new PaymentStepsSheet($this->data),
            new DocumentsSheet($this->data),
        ];

        return $sheets;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // This won't be used since we're using multiple sheets
        return collect([]);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        // This won't be used since we're using multiple sheets
        return [];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        // This won't be used since we're using multiple sheets
        return [];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Contract Report';
    }

    /**
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // This won't be used since we're using multiple sheets
        ];
    }
}
