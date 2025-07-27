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
     * Extract all documents from contract documents
     *
     * @return array
     */
    protected function extractDocuments(): array
    {
        $documents = [];
        
        // Use contract-level documents instead of payment step documents
        if (isset($this->data['contract_documents']) && !empty($this->data['contract_documents'])) {
            foreach ($this->data['contract_documents'] as $document) {
                $documents[] = [
                    'name' => $document['name'],
                    'file_path' => $document['file_path'],
                    'file_size' => $this->formatFileSize($document['file_size']),
                    'mime_type' => $document['mime_type'],
                    'uploaded_at' => $document['uploaded_at'],
                    'uploaded_by' => $document['uploaded_by'],
                ];
            }
        }
        
        return $documents;
    }

    /**
     * Format file size in human readable format
     *
     * @param int $bytes
     * @return string
     */
    protected function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
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
            'File Name',
            'File Size',
            'File Type',
            'Uploaded At',
            'Uploaded By',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row['name'],
            $row['file_size'],
            $row['mime_type'],
            $row['uploaded_at'],
            $row['uploaded_by'],
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
            1 => ['font' => ['bold' => true, 'size' => 27]], // Increased from 12 to 27 (additional 40% increase)
        ];
    }
}
