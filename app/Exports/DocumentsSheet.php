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

class DocumentsSheet implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
{
    protected $data;
    protected $documents;

    public function __construct(array $data)
    {
        $this->data = $data;
        $this->documents = $this->extractDocuments();
    }

    /**
     * Extract all documents from payment steps
     *
     * @return array
     */
    protected function extractDocuments(): array
    {
        $documents = [];
        
        foreach ($this->data['payment_steps'] as $step) {
            if (!empty($step['documents'])) {
                foreach ($step['documents'] as $document) {
                    $documents[] = [
                        'step_number' => $step['step_number'],
                        'type' => $document['type'],
                        'name' => $document['name'],
                        'uploaded_at' => $document['uploaded_at'],
                    ];
                }
            }
        }
        
        return $documents;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return collect($this->documents);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Step Number',
            'Document Type',
            'File Name',
            'Uploaded At',
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
            ucfirst(str_replace('_', ' ', $row['type'])),
            $row['name'],
            $row['uploaded_at'],
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Documents';
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
        ];
    }
}
