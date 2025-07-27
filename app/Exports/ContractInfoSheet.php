<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;
use Illuminate\Support\Collection;

class ContractInfoSheet implements FromArray, WithTitle, WithStyles, ShouldAutoSize, WithColumnWidths
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
        $data[] = ['កម្ពុជាការតាមដានដី - ព្រៃព្រឹកសញ្ញា', '', ''];
        $data[] = ['', '', ''];
        
        // Contract Information Section
        $data[] = ['📋 ព័ត៌មានសញ្ញា', '', ''];
        $data[] = ['លេខសញ្ញា:', $this->data['contract']['id'], ''];
        $data[] = ['កាលបរិច្ឆេទសញ្ញា:', $this->data['contract']['date'], ''];
        $data[] = ['ស្ថានភាព:', ucfirst($this->data['contract']['status']), ''];
        $data[] = ['ចំនួនសរុប:', '$' . number_format($this->data['contract']['total_amount'], 2), ''];
        $data[] = ['', '', ''];
        
        // Buyer Information Section
        $data[] = ['👤 ព័ត៌មានអ្នកទិញ', '', ''];
        if (isset($this->data['buyers']) && count($this->data['buyers']) > 0) {
            foreach ($this->data['buyers'] as $index => $buyer) {
                $buyerNumber = $index + 1;
                if ($index > 0) $data[] = ['', '', '']; // Separator between buyers
                $data[] = ["អ្នកទិញ #{$buyerNumber}", '', ''];
                $data[] = ['ឈ្មោះ:', $buyer['name'], ''];
                $data[] = ['ទូរស័ព្ទ:', $buyer['phone'] ?? 'N/A', ''];
                $data[] = ['អាសយដ្ឋាន:', $buyer['address'] ?? 'N/A', ''];
            }
        } elseif (isset($this->data['buyer'])) {
            $data[] = ['ឈ្មោះ:', $this->data['buyer']['name'], ''];
            $data[] = ['ទូរស័ព្ទ:', $this->data['buyer']['phone'] ?? 'N/A', ''];
            $data[] = ['អាសយដ្ឋាន:', $this->data['buyer']['address'] ?? 'N/A', ''];
        }
        $data[] = ['', '', ''];
        
        // Seller Information Section
        $data[] = ['🏢 ព័ត៌មានអ្នកលក់', '', ''];
        if (isset($this->data['sellers']) && count($this->data['sellers']) > 0) {
            foreach ($this->data['sellers'] as $index => $seller) {
                $sellerNumber = $index + 1;
                if ($index > 0) $data[] = ['', '', '']; // Separator between sellers
                $data[] = ["អ្នកលក់ #{$sellerNumber}", '', ''];
                $data[] = ['ឈ្មោះ:', $seller['name'], ''];
                $data[] = ['ទូរស័ព្ទ:', $seller['phone'] ?? 'N/A', ''];
                $data[] = ['អាសយដ្ឋាន:', $seller['address'] ?? 'N/A', ''];
            }
        } elseif (isset($this->data['seller'])) {
            $data[] = ['ឈ្មោះ:', $this->data['seller']['name'], ''];
            $data[] = ['ទូរស័ᖖ្ទ:', $this->data['seller']['phone'] ?? 'N/A', ''];
            $data[] = ['អាសយដ្ឋាន:', $this->data['seller']['address'] ?? 'N/A', ''];
        }
        $data[] = ['', '', ''];
        
        // Land Information Section
        $data[] = ['🌞️ ព័ត៌មានដី', '', ''];
        if (isset($this->data['lands']) && count($this->data['lands']) > 0) {
            foreach ($this->data['lands'] as $index => $land) {
                $landNumber = $index + 1;
                if ($index > 0) $data[] = ['', '', '']; // Separator between lands
                $data[] = ["ដី #{$landNumber}", '', ''];
                $data[] = ['លេខដីធ្លី:', $land['plot_number'], ''];
                $data[] = ['ទំហំ:', $land['size'] . ' m²', ''];
                $data[] = ['ទីតាំង:', $land['location'], ''];
                $data[] = ['តម្លៃក្នុងមួយ m²:', '$' . number_format($land['price_per_m2'], 2), ''];
                $data[] = ['តម្លៃសរុប:', '$' . number_format($land['total_price'], 2), ''];
            }
        } elseif (isset($this->data['land'])) {
            $data[] = ['លេខដីធ្លី:', $this->data['land']['plot_number'], ''];
            $data[] = ['ទំហំ:', $this->data['land']['size'], ''];
            $data[] = ['ទីតាំង:', $this->data['land']['location'], ''];
        }
        
    return $data;
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 25,
            'B' => 40,
            'C' => 15,
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
        $lastRow = $sheet->getHighestRow();
        
        // Title styling - Increased font size by 100% total (60% + 40%) for Khmer readability
        $sheet->mergeCells('A1:C1');
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
        
        // Section headers styling (rows with emojis)
        for ($row = 1; $row <= $lastRow; $row++) {
            $cellValue = $sheet->getCell('A' . $row)->getValue();
            
            // Section headers
            if (strpos($cellValue, '📋') !== false || 
                strpos($cellValue, '👤') !== false || 
                strpos($cellValue, '🏢') !== false || 
                strpos($cellValue, '🏞️') !== false || 
                strpos($cellValue, '📊') !== false) {
                
                $sheet->mergeCells('A' . $row . ':C' . $row);
                $sheet->getStyle('A' . $row)->applyFromArray([
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
                        'horizontal' => Alignment::HORIZONTAL_LEFT,
                        'vertical' => Alignment::VERTICAL_CENTER
                    ]
                ]);
            }
            
            // Sub-section headers (Buyer #1, Seller #1, etc.)
            if ($cellValue !== null && preg_match('/^(Buyer|Seller|Land) #\d+$/', $cellValue)) {
                $sheet->mergeCells('A' . $row . ':C' . $row);
                $sheet->getStyle('A' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 25, // Increased from 18 to 25 (additional 40% increase)
                        'color' => ['rgb' => '2E5984']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F2F2F2']
                    ]
                ]);
            }
            
            // Field labels (first column with colons)
            if ($cellValue !== null && strpos($cellValue, ':') !== false && $cellValue !== '') {
                $sheet->getStyle('A' . $row)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => '2E5984']
                    ]
                ]);
            }
        }
        
        // Apply borders to all data
        $sheet->getStyle('A1:C' . $lastRow)->applyFromArray([
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
