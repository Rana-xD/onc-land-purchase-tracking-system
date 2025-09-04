<?php

namespace App\Services;

use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Facades\Storage;
use Exception;

class KhmerPDFService
{
    /**
     * Generate PDF from HTML content with perfect Khmer Unicode rendering.
     *
     * @param string $html
     * @param string $filename
     * @return string Path to generated PDF
     * @throws Exception
     */
    public function generateFromHTML($html, $filename, $contractType = 'deposit_contract')
    {
        try {
            // Increase PHP execution time for PDF generation
            set_time_limit(60);
            
            // Wrap content with proper HTML template for Khmer fonts
            $wrappedHTML = $this->wrapWithTemplate($html, $contractType);
            
            // Ensure contracts directory exists
            Storage::disk('local')->makeDirectory('contracts');
            $pdfPath = storage_path('app/contracts/' . $filename);
            
            // Generate PDF using Browsershot with optimized settings
            Browsershot::html($wrappedHTML)
                ->setNodeBinary('/opt/homebrew/bin/node')
                ->setNpmBinary('/opt/homebrew/bin/npm')
                ->format('A4')
                ->margins(20, 20, 20, 20)
                ->showBackground()
                ->timeout(20) // Reduced timeout for faster generation
                ->setOption('args', [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--disable-default-apps',
                    '--disable-extensions',
                    '--disable-web-security',
                    '--disable-features=TranslateUI'
                ])
                ->setOption('viewport', ['width' => 794, 'height' => 1123])
                ->save($pdfPath);
            
            return $pdfPath;
            
        } catch (Exception $e) {
            throw new Exception('PDF generation failed: ' . $e->getMessage());
        }
    }

    /**
     * Wrap content with proper HTML structure and Khmer fonts.
     *
     * @param string $content
     * @param string $contractType
     * @return string
     */
    public function wrapWithTemplate($content, $contractType = 'deposit_contract')
    {
        // Check if content is already a complete HTML document
        if (strpos($content, '<!DOCTYPE html>') !== false) {
            return $content;
        }
        
        // Use template files for complete contract generation
        if (strpos($content, '{{') !== false) {
            return $this->getContractTemplate($contractType);
        }
        
        return '<!DOCTYPE html>
<html lang="km">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . ($contractType === 'sale_contract' ? 'កិច្ចសន្យាលក់ដី' : 'កិច្ចសន្យាកក់ប្រាក់ទិញដី') . '</title>
    
    <style>
        
        /* Simplified font declarations - no external loading */
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: "Khmer OS", "DejaVu Sans", serif;
            line-height: 1.6;
            margin: 0;
            padding: 20mm;
            background: white;
            color: #000;
            font-size: 14px;
            font-weight: 400;
        }
        
        .document-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
            font-family: "Khmer OS", "DejaVu Sans", serif;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        
        .kingdom-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            font-family: "Koh Santepheap", serif;
        }
        
        .nation-religion-king {
            font-size: 14px;
            margin-bottom: 5px;
            font-family: "Koh Santepheap", serif;
        }
        
        .contract-title {
            font-size: 20px;
            font-weight: 900;
            margin: 20px 0;
            text-decoration: underline;
            font-family: "Koh Santepheap", serif;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 15px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            font-family: "Koh Santepheap", serif;
        }
        
        .party-info {
            background: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #1890ff;
            margin-bottom: 15px;
        }
        
        .party-title {
            font-weight: 700;
            font-size: 15px;
            margin-bottom: 10px;
            color: #1890ff;
            font-family: "Koh Santepheap", serif;
        }
        
        .info-row {
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
        }
        
        .info-label {
            font-weight: 600;
            min-width: 120px;
            margin-right: 10px;
            font-family: "Koh Santepheap", serif;
        }
        
        .info-value {
            flex: 1;
            border-bottom: 1px dotted #999;
            min-height: 20px;
            padding-bottom: 2px;
            font-family: "Koh Santepheap", serif;
        }
        
        .land-details {
            background: #f0f8f0;
            padding: 15px;
            border-left: 4px solid #52c41a;
            margin-bottom: 15px;
        }
        
        .payment-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-family: "Koh Santepheap", serif;
        }
        
        .payment-table th,
        .payment-table td {
            border: 1px solid #333;
            padding: 10px;
            text-align: center;
            font-family: "Koh Santepheap", serif;
        }
        
        .payment-table th {
            background: #f0f0f0;
            font-weight: 700;
        }
        
        .terms-section {
            background: #fff9e6;
            padding: 20px;
            border: 1px solid #ffd666;
            border-radius: 5px;
        }
        
        .terms-title {
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 15px;
            color: #d48806;
            font-family: "Koh Santepheap", serif;
        }
        
        .term-item {
            margin-bottom: 12px;
            padding-left: 20px;
            position: relative;
            font-family: "Koh Santepheap", serif;
            line-height: 1.8;
        }
        
        .term-item:before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        
        .signatures {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            page-break-inside: avoid;
        }
        
        .signature-block {
            text-align: center;
            min-width: 200px;
            margin-bottom: 30px;
            font-family: "Koh Santepheap", serif;
        }
        
        .signature-title {
            font-weight: 700;
            margin-bottom: 10px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            font-family: "Koh Santepheap", serif;
        }
        
        .signature-line {
            border-bottom: 1px solid #333;
            height: 60px;
            margin: 20px 0 10px 0;
        }
        
        .date-location {
            text-align: right;
            margin-bottom: 30px;
            font-style: italic;
            font-family: "Koh Santepheap", serif;
        }
        
        .highlight {
            background: #fff2e6;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        /* Ensure Khmer text renders properly */
        p, div, span, td, th, li, h1, h2, h3, h4, h5, h6, strong, b, em, i {
            font-family: "Khmer OS", "DejaVu Sans", serif;
            line-height: 1.6;
        }
        
        /* Print optimizations */
        @media print {
            body {
                padding: 0;
                margin: 0;
            }
            
            .document-container {
                max-width: none;
            }
            
            .signatures {
                page-break-inside: avoid;
            }
        }
        
        /* Page break handling */
        .page-break {
            page-break-before: always;
        }
        
        .no-break {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="document-container">
        ' . $content . '
    </div>
</body>
</html>';
    }

    /**
     * Generate PDF and return as download response.
     *
     * @param string $html
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * @throws Exception
     */
    public function generateAndDownload($html, $filename, $contractType = 'deposit_contract')
    {
        // Increase PHP execution time
        set_time_limit(90);
        
        try {
            // Use only Browsershot for better Khmer Unicode support
            $pdfPath = $this->generateFromHTML($html, $filename, $contractType);
            return response()->download($pdfPath, $filename, [
                'Content-Type' => 'application/pdf',
            ])->deleteFileAfterSend(true);
        } catch (Exception $e) {
            throw new Exception('PDF generation failed: ' . $e->getMessage());
        }
    }

    /**
     * Fallback PDF generation using DomPDF.
     *
     * @param string $html
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    public function generateWithDomPDF($html, $filename)
    {
        // Simplified HTML template for DomPDF (faster loading)
        $simplifiedHTML = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: "DejaVu Sans", sans-serif;
            font-size: 14px;
            line-height: 1.6;
            margin: 20mm;
            color: #000;
        }
        .document-container {
            max-width: 100%;
        }
        h1, h2, h3 { font-weight: bold; }
        .header { text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #000; padding: 8px; }
    </style>
</head>
<body>
    <div class="document-container">' . $html . '</div>
</body>
</html>';

        // Use Laravel's built-in PDF generation
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($simplifiedHTML);
        
        // Configure for faster generation
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isPhpEnabled' => false,
            'defaultFont' => 'DejaVu Sans',
            'isRemoteEnabled' => false,
            'debugKeepTemp' => false
        ]);
        
        return $pdf->download($filename);
    }

    /**
     * Get contract template based on contract type.
     *
     * @param string $contractType
     * @return string
     * @throws Exception
     */
    private function getContractTemplate($contractType = 'deposit_contract')
    {
        $templateFile = $contractType === 'sale_contract' ? 'sale_contract.html' : 'deposit_contract.html';
        $templatePath = resource_path("templates/{$templateFile}");
        
        if (!file_exists($templatePath)) {
            throw new \Exception("Template file not found: {$templatePath}");
        }
        
        $template = file_get_contents($templatePath);
        
        // Replace {{UNIFIED_STYLES}} with the CSS from the wrapWithTemplate method
        $css = $this->getUnifiedStyles();
        $template = str_replace('{{UNIFIED_STYLES}}', $css, $template);
        
        return $template;
    }

    /**
     * Get unified CSS styles for contract templates.
     *
     * @return string
     */
    private function getUnifiedStyles()
    {
        return '
        /* Simplified font declarations - no external loading */
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: "Khmer OS", "DejaVu Sans", serif;
            line-height: 1.6;
            margin: 0;
            padding: 20mm;
            background: white;
            color: #000;
            font-size: 14px;
            font-weight: 400;
        }
        
        .document-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
            font-family: "Khmer OS", "DejaVu Sans", serif;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        
        .kingdom-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            font-family: "Koh Santepheap", serif;
        }
        
        .nation-religion-king {
            font-size: 14px;
            margin-bottom: 5px;
            font-family: "Koh Santepheap", serif;
        }
        
        .contract-title {
            font-size: 20px;
            font-weight: 900;
            margin: 20px 0;
            text-decoration: underline;
            font-family: "Koh Santepheap", serif;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 15px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            font-family: "Koh Santepheap", serif;
        }
        
        .party-info {
            background: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #1890ff;
            margin-bottom: 15px;
        }
        
        .party-title {
            font-weight: 700;
            font-size: 15px;
            margin-bottom: 10px;
            color: #1890ff;
            font-family: "Koh Santepheap", serif;
        }
        
        .info-row {
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
        }
        
        .info-label {
            font-weight: 600;
            min-width: 120px;
            margin-right: 10px;
            font-family: "Koh Santepheap", serif;
        }
        
        .info-value {
            flex: 1;
            border-bottom: 1px dotted #999;
            min-height: 20px;
            padding-bottom: 2px;
            font-family: "Koh Santepheap", serif;
        }
        
        .land-details {
            background: #f0f8f0;
            padding: 15px;
            border-left: 4px solid #52c41a;
            margin-bottom: 15px;
        }
        
        .payment-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-family: "Koh Santepheap", serif;
        }
        
        .payment-table th,
        .payment-table td {
            border: 1px solid #333;
            padding: 10px;
            text-align: center;
            font-family: "Koh Santepheap", serif;
        }
        
        .payment-table th {
            background: #f0f0f0;
            font-weight: 700;
        }
        
        .terms-section {
            background: #fff9e6;
            padding: 20px;
            border: 1px solid #ffd666;
            border-radius: 5px;
        }
        
        .terms-title {
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 15px;
            color: #d48806;
            font-family: "Koh Santepheap", serif;
        }
        
        .term-item {
            margin-bottom: 12px;
            padding-left: 20px;
            position: relative;
            font-family: "Koh Santepheap", serif;
            line-height: 1.8;
        }
        
        .term-item:before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        
        .signatures {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            page-break-inside: avoid;
        }
        
        .signature-block {
            text-align: center;
            min-width: 200px;
            margin-bottom: 30px;
            font-family: "Koh Santepheap", serif;
        }
        
        .signature-title {
            font-weight: 700;
            margin-bottom: 10px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            font-family: "Koh Santepheap", serif;
        }
        
        .signature-line {
            border-bottom: 1px solid #333;
            height: 60px;
            margin: 20px 0 10px 0;
        }
        
        .date-location {
            text-align: right;
            margin-bottom: 30px;
            font-style: italic;
            font-family: "Koh Santepheap", serif;
        }
        
        .highlight {
            background: #fff2e6;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        /* Ensure Khmer text renders properly */
        p, div, span, td, th, li, h1, h2, h3, h4, h5, h6, strong, b, em, i {
            font-family: "Khmer OS", "DejaVu Sans", serif;
            line-height: 1.6;
        }
        
        /* Print optimizations */
        @media print {
            body {
                padding: 0;
                margin: 0;
            }
            
            .document-container {
                max-width: none;
            }
            
            .signatures {
                page-break-inside: avoid;
            }
        }
        
        /* Page break handling */
        .page-break {
            page-break-before: always;
        }
        
        .no-break {
            page-break-inside: avoid;
        }';
    }

    /**
     * Test Khmer Unicode rendering with complex subscripts.
     *
     * @return string
     */
    public function getKhmerTestContent()
    {
        return '
        <div style="padding: 20px; font-family: \'Koh Santepheap\', serif;">
            <h2>ការធ្វើតេស្តអក្សរខ្មែរ</h2>
            <p><strong>តេស្តអក្សរខ្មែរដែលមានជើងអក្សរ:</strong></p>
            <ul>
                <li>ខ្ញុំបាទ/ខ្ញុំនាងខ្ញុំ - Personal pronouns with subscripts</li>
                <li>ស្រុកខ្មែរ - Cambodia with subscripts</li>
                <li>កិច្ចសន្យា - Contract</li>
                <li>ជ្រើសរើស - Choose/Select</li>
                <li>ក្រុមហ៊ុន - Company</li>
                <li>ស្ថាបត្យកម្ម - Architecture</li>
                <li>ព្រះរាជាណាចក្រកម្ពុជា - Kingdom of Cambodia</li>
            </ul>
            <p><strong>តេស្តលេខខ្មែរ:</strong> ១២៣៤៥៦៧ៈៈ០</p>
            <p><strong>តេស្តការរៀបចំអក្សរ:</strong> នេះជាការធ្វើតេស្តដើម្បីមើលថាតើអក្សរខ្មែរបង្ហាញបានត្រឹមត្រូវដែរឬទេ។</p>
        </div>';
    }
}
