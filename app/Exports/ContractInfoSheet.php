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
        // Create a collection with contract info
        $collection = collect([
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
        ]);
        
        // Add buyers information - handle both multiple buyers and legacy single buyer
        if (isset($this->data['buyers']) && count($this->data['buyers']) > 0) {
            // Process multiple buyers
            foreach ($this->data['buyers'] as $index => $buyer) {
                $buyerNumber = $index + 1;
                $collection->push([
                    'section' => 'Buyer Information',
                    'key' => "Buyer #{$buyerNumber} - Name",
                    'value' => $buyer['name'],
                ]);
                $collection->push([
                    'section' => 'Buyer Information',
                    'key' => "Buyer #{$buyerNumber} - Phone",
                    'value' => $buyer['phone'] ?? 'N/A',
                ]);
                $collection->push([
                    'section' => 'Buyer Information',
                    'key' => "Buyer #{$buyerNumber} - Address",
                    'value' => $buyer['address'] ?? 'N/A',
                ]);
            }
        } elseif (isset($this->data['buyer'])) {
            // Fallback for backward compatibility with single buyer
            $collection->push([
                'section' => 'Buyer Information',
                'key' => 'Name',
                'value' => $this->data['buyer']['name'],
            ]);
            $collection->push([
                'section' => 'Buyer Information',
                'key' => 'Phone',
                'value' => $this->data['buyer']['phone'] ?? 'N/A',
            ]);
            $collection->push([
                'section' => 'Buyer Information',
                'key' => 'Address',
                'value' => $this->data['buyer']['address'] ?? 'N/A',
            ]);
        }
        
        // Add sellers information - handle both multiple sellers and legacy single seller
        if (isset($this->data['sellers']) && count($this->data['sellers']) > 0) {
            // Process multiple sellers
            foreach ($this->data['sellers'] as $index => $seller) {
                $sellerNumber = $index + 1;
                $collection->push([
                    'section' => 'Seller Information',
                    'key' => "Seller #{$sellerNumber} - Name",
                    'value' => $seller['name'],
                ]);
                $collection->push([
                    'section' => 'Seller Information',
                    'key' => "Seller #{$sellerNumber} - Phone",
                    'value' => $seller['phone'] ?? 'N/A',
                ]);
                $collection->push([
                    'section' => 'Seller Information',
                    'key' => "Seller #{$sellerNumber} - Address",
                    'value' => $seller['address'] ?? 'N/A',
                ]);
            }
        } elseif (isset($this->data['seller'])) {
            // Fallback for backward compatibility with single seller
            $collection->push([
                'section' => 'Seller Information',
                'key' => 'Name',
                'value' => $this->data['seller']['name'],
            ]);
            $collection->push([
                'section' => 'Seller Information',
                'key' => 'Phone',
                'value' => $this->data['seller']['phone'] ?? 'N/A',
            ]);
            $collection->push([
                'section' => 'Seller Information',
                'key' => 'Address',
                'value' => $this->data['seller']['address'] ?? 'N/A',
            ]);
        }
        
        // Add lands information - handle both multiple lands and legacy single land
        if (isset($this->data['lands']) && count($this->data['lands']) > 0) {
            // Process multiple lands
            foreach ($this->data['lands'] as $index => $land) {
                $landNumber = $index + 1;
                $collection->push([
                    'section' => 'Land Information',
                    'key' => "Land #{$landNumber} - Plot Number",
                    'value' => $land['plot_number'],
                ]);
                $collection->push([
                    'section' => 'Land Information',
                    'key' => "Land #{$landNumber} - Size",
                    'value' => $land['size'] . ' m²',
                ]);
                $collection->push([
                    'section' => 'Land Information',
                    'key' => "Land #{$landNumber} - Location",
                    'value' => $land['location'],
                ]);
                $collection->push([
                    'section' => 'Land Information',
                    'key' => "Land #{$landNumber} - Price per m²",
                    'value' => '$' . number_format($land['price_per_m2'], 2),
                ]);
                $collection->push([
                    'section' => 'Land Information',
                    'key' => "Land #{$landNumber} - Total Price",
                    'value' => '$' . number_format($land['total_price'], 2),
                ]);
            }
        } elseif (isset($this->data['land'])) {
            // Fallback for backward compatibility with single land
            $collection->push([
                'section' => 'Land Information',
                'key' => 'Plot Number',
                'value' => $this->data['land']['plot_number'],
            ]);
            $collection->push([
                'section' => 'Land Information',
                'key' => 'Size',
                'value' => $this->data['land']['size'],
            ]);
            $collection->push([
                'section' => 'Land Information',
                'key' => 'Location',
                'value' => $this->data['land']['location'],
            ]);
        }
        
        return $collection;
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
