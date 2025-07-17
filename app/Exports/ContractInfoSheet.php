<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;

class ContractInfoSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
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
        // Create a collection with contract, buyer, seller, and land info
        return collect([
            [
                'section' => 'Contract Information',
                'key' => 'Contract ID',
                'value' => $this->data['contract']['id'],
            ],
            [
                'section' => 'Contract Information',
                'key' => 'Contract Date',
                'value' => $this->data['contract']['date'],
            ],
            [
                'section' => 'Contract Information',
                'key' => 'Status',
                'value' => ucfirst($this->data['contract']['status']),
            ],
            [
                'section' => 'Contract Information',
                'key' => 'Total Amount',
                'value' => '$' . number_format($this->data['contract']['total_amount'], 2),
            ],
            [
                'section' => 'Buyer Information',
                'key' => 'Name',
                'value' => $this->data['buyer']['name'],
            ],
            [
                'section' => 'Buyer Information',
                'key' => 'Phone',
                'value' => $this->data['buyer']['phone'] ?? 'N/A',
            ],
            [
                'section' => 'Buyer Information',
                'key' => 'Address',
                'value' => $this->data['buyer']['address'] ?? 'N/A',
            ],
            [
                'section' => 'Seller Information',
                'key' => 'Name',
                'value' => $this->data['seller']['name'],
            ],
            [
                'section' => 'Seller Information',
                'key' => 'Phone',
                'value' => $this->data['seller']['phone'] ?? 'N/A',
            ],
            [
                'section' => 'Seller Information',
                'key' => 'Address',
                'value' => $this->data['seller']['address'] ?? 'N/A',
            ],
            [
                'section' => 'Land Information',
                'key' => 'Plot Number',
                'value' => $this->data['land']['plot_number'],
            ],
            [
                'section' => 'Land Information',
                'key' => 'Size',
                'value' => $this->data['land']['size'],
            ],
            [
                'section' => 'Land Information',
                'key' => 'Location',
                'value' => $this->data['land']['location'],
            ],
        ]);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Section',
            'Field',
            'Value',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row['section'],
            $row['key'],
            $row['value'],
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Contract Information';
    }

    /**
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the header row
            1 => ['font' => ['bold' => true, 'size' => 12]],
            
            // Add a bit of styling to make it more readable
            'A' => ['font' => ['bold' => true]],
        ];
    }
}
