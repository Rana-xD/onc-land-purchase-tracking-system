<?php

namespace App\Services;

use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
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

            // Ensure contracts directory exists with proper permissions
            $contractsDir = storage_path('app/contracts');

            // Create directory if it doesn't exist (using native PHP for reliability)
            if (!is_dir($contractsDir)) {
                if (!mkdir($contractsDir, 0755, true)) {
                    throw new Exception('Could not create contracts directory: ' . $contractsDir);
                }
            }

            // Ensure directory is writable
            if (!is_writable($contractsDir)) {
                if (!chmod($contractsDir, 0755)) {
                    throw new Exception('Could not set permissions for contracts directory: ' . $contractsDir);
                }
            }

            $pdfPath = $contractsDir . '/' . $filename;

            // Generate PDF using Browsershot with optimized settings for Khmer Unicode
            $browsershot = Browsershot::html($wrappedHTML);

            // Set Node.js paths dynamically for all environments
            $nodePath = exec('which node 2>/dev/null');
            $npmPath = exec('which npm 2>/dev/null');

            if ($nodePath && file_exists($nodePath)) {
                $browsershot->setNodeBinary($nodePath);
            } else {
                // Fallback paths for common installations
                $commonNodePaths = [
                    '/opt/homebrew/bin/node',    // Homebrew on Apple Silicon
                    '/usr/local/bin/node',       // Homebrew on Intel Mac
                    '/usr/bin/node',             // System installation
                    '/home/ubuntu/.nvm/versions/node/latest/bin/node'  // NVM on Ubuntu
                ];

                foreach ($commonNodePaths as $path) {
                    if (file_exists($path)) {
                        $browsershot->setNodeBinary($path);
                        break;
                    }
                }
            }

            if ($npmPath && file_exists($npmPath)) {
                $browsershot->setNpmBinary($npmPath);
            } else {
                // Fallback paths for npm
                $commonNpmPaths = [
                    '/opt/homebrew/bin/npm',     // Homebrew on Apple Silicon  
                    '/usr/local/bin/npm',        // Homebrew on Intel Mac
                    '/usr/bin/npm',              // System installation
                    '/home/ubuntu/.nvm/versions/node/latest/bin/npm'   // NVM on Ubuntu
                ];

                foreach ($commonNpmPaths as $path) {
                    if (file_exists($path)) {
                        $browsershot->setNpmBinary($path);
                        break;
                    }
                }
            }

            $browsershot->format('A4')
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
                    '--disable-features=TranslateUI',
                    '--font-render-hinting=none',
                    '--disable-font-subpixel-positioning'
                ])
                ->setOption('viewport', ['width' => 794, 'height' => 1123])
                ->waitUntilNetworkIdle()
                ->save($pdfPath);

            return $pdfPath;
        } catch (Exception $e) {
            // Log detailed error information for debugging
            Log::error('KhmerPDFService Error: ' . $e->getMessage(), [
                'filename' => $filename,
                'contract_type' => $contractType,
                'node_path' => exec('which node 2>/dev/null'),
                'npm_path' => exec('which npm 2>/dev/null'),
                'puppeteer_check' => file_exists(base_path('node_modules/puppeteer')),
                'storage_writable' => is_writable(storage_path('app')),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception('PDF generation failed: ' . $e->getMessage() . ' (Check logs for more details)');
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

        // Ensure UTF-8 encoding for content
        if (!mb_check_encoding($content, 'UTF-8')) {
            $content = mb_convert_encoding($content, 'UTF-8', 'auto');
        }

        $title = ($contractType === 'sale_contract' ? 'កិច្ចសន្យាលក់ដី' : 'កិច្ចសន្យាកក់ប្រាក់ទិញដី');

        return '<!DOCTYPE html>
<html lang="km">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $title . '</title>
    
    <style>
        ' . $this->getUnifiedStylesForContract($contractType) . '
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

        // Ensure UTF-8 encoding
        if (!mb_check_encoding($template, 'UTF-8')) {
            $template = mb_convert_encoding($template, 'UTF-8', 'auto');
        }

        // Replace {{UNIFIED_STYLES}} with the CSS from the wrapWithTemplate method
        $css = $this->getUnifiedStylesForContract($contractType);
        $template = str_replace('{{UNIFIED_STYLES}}', $css, $template);

        return $template;
    }

    /**
     * Get unified CSS styles for contract templates (for template files).
     *
     * @return string
     */
    private function getUnifiedStyles()
    {
        return '<style>' . \App\Services\ContractStyleService::getTemplateStyles() . '</style>';
    }

    /**
     * Get unified CSS styles based on contract type.
     * Now uses the unified CSS file for both contract types.
     *
     * @param string $contractType
     * @return string
     */
    private function getUnifiedStylesForContract($contractType = 'deposit_contract')
    {
        // Use unified CSS file for both contract types
        return '<style>' . \App\Services\ContractStyleService::getTemplateStyles() . '</style>';
    }


    /**
     * Get complete deposit contract styles (print-ready).
     *
     * @return string
     */
    public function getDepositContractStyles()
    {
        return '<style>
        @import url("https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap");
        
        body {
            font-family: "Koh Santepheap", "Khmer OS", "Hanuman", serif !important;
            font-size: 14pt !important;
            line-height: 1.6 !important;
            padding: 40px 20px !important;
            margin: 0 !important;
            background: white !important;
            color: #000 !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
        }
        
        .document-container {
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        
        .header {
            text-align: center !important;
            margin-bottom: 30px !important;
        }

        .kingdom-title {
            font-size: 18pt !important;
            font-weight: 700 !important;
            margin-bottom: 5px !important;
            text-align: center !important;
        }

        .nation-religion-king {
            font-size: 18pt !important;
            font-weight: 700 !important;
            margin-bottom: 5px !important;
            text-align: center !important;
        }

        .contract-title {
            font-size: 16pt !important;
            font-weight: 700 !important;
            margin: 15px 0 !important;
            text-decoration: underline !important;
            text-underline-offset: 3px !important;
            text-align: center !important;
        }

        p {
            margin: 12px 0 !important;
            text-align: justify !important;
            text-indent: 40px !important;
            line-height: 1.6 !important;
        }

        .indent-text {
            text-indent: 50px !important;
        }

        strong {
            font-weight: 700 !important;
        }

        table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 20px 0 !important;
        }

        table td, table th {
            border: 1px solid #000 !important;
            padding: 8px 12px !important;
            text-align: left !important;
            font-size: 13pt !important;
        }

        table th {
            font-weight: 700 !important;
            background-color: #f5f5f5 !important;
        }

        /* Fingerprint section styles - matching React component */
        .fingerprint-section {
            margin-top: 40px !important;
            page-break-inside: avoid !important;
        }

        .fingerprint-row {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-end !important;
            margin-top: 30px !important;
        }

        .fingerprint-group {
            flex: 1 !important;
            text-align: center !important;
            margin: 0 10px !important;
        }

        .fingerprint-label {
            font-size: 12pt !important;
            margin-bottom: 10px !important;
            font-weight: 600 !important;
        }

        .fingerprint-box {
            width: 80px !important;
            height: 120px !important;
            margin: 10px auto !important;
            border: 1px solid #000 !important;
        }

        .signature-line {
            margin-top: 15px !important;
            padding-top: 5px !important;
            border-top: 1px dotted #333 !important;
            font-size: 11pt !important;
            min-height: 20px !important;
        }

        /* Additional classes from React component */
        .party-info {
            margin: 15px 0 !important;
            background: none !important;
            border: none !important;
            padding: 0 !important;
        }

        .party-info p {
            margin: 0 !important;
            text-align: justify !important;
            line-height: 1.6 !important;
            text-indent: 50px !important;
            word-wrap: break-word !important;
        }

        .contract-intro {
            text-align: center !important;
            margin: 25px 0 !important;
            font-weight: 600 !important;
        }

        .contract-intro p {
            text-align: center !important;
            text-indent: 0 !important;
            margin: 0 !important;
        }

        .land-section {
            margin: 20px 0 !important;
            text-align: justify !important;
        }

        .land-section p {
            text-indent: 40px !important;
            margin: 15px 0 !important;
            line-height: 1.6 !important;
        }

        .land-details, .conditions {
            list-style: none !important;
            padding-left: 0 !important;
            margin: 15px 0 !important;
        }

        .land-details li, .conditions li {
            margin: 10px 0 !important;
            padding-left: 50px !important;
            text-indent: -30px !important;
            line-height: 1.6 !important;
            text-align: justify !important;
        }

        .land-details li:before, .conditions li:before {
            content: "-" !important;
            font-weight: bold !important;
            margin-right: 10px !important;
        }

        .date-location {
            text-align: justify !important;
            margin: 20px 0 !important;
        }

        .date-location p {
            text-indent: 40px !important;
            line-height: 1.6 !important;
        }

        .additional-terms {
            margin: 20px 0 !important;
            text-align: justify !important;
        }

        .additional-terms p {
            text-indent: 40px !important;
            line-height: 1.6 !important;
        }

        .contract-date {
            margin: 30px 0 !important;
        }

        .contract-date p {
            text-align: center !important;
            font-weight: 600 !important;
            text-indent: 0 !important;
            margin: 0 !important;
        }

        /* Ensure all elements use proper Khmer typography */
        p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
            font-family: "Koh Santepheap", "Khmer OS", "Hanuman", serif !important;
            letter-spacing: 0.3px !important;
        }
        </style>';
    }

    /**
     * Get complete sale contract styles (print-ready).
     *
     * @return string
     */
    private function getSaleContractStyles()
    {
        return '
        @import url("https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap");

        * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        body {
            font-family: "Koh Santepheap", "Khmer OS", "Hanuman", serif !important;
            font-size: 14pt !important;
            line-height: 1.6 !important;
            padding: 20px 5px !important;
            margin: 0 !important;
            background: white !important;
            color: #000 !important;
        }
        
        .document-container {
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        
        .indent-text {
            text-indent: 50px !important;
        }
        
        .header {
            text-align: center !important;
            margin-bottom: 30px !important;
        }

        .kingdom-title {
            font-size: 18pt !important;
            font-weight: 700 !important;
            margin-bottom: 5px !important;
            text-align: center !important;
        }

        .nation-religion-king {
            font-size: 18pt !important;
            margin-bottom: 5px !important;
            text-align: center !important;
        }

        .contract-title {
            font-size: 16pt !important;
            font-weight: 700 !important;
            margin: 15px 0 !important;
            text-decoration: underline !important;
            text-underline-offset: 3px !important;
            text-align: center !important;
        }

        .party-info {
            margin: 15px 0 !important;
            background: none !important;
            border: none !important;
            padding: 0 !important;
        }

        .party-info p {
            margin: 0 !important;
            text-align: justify !important;
            line-height: 1.6 !important;
            text-indent: 50px !important;
            word-wrap: break-word !important;
        }

        .contract-intro {
            text-align: center !important;
            margin: 25px 0 !important;
            font-weight: 600 !important;
        }

        .contract-intro p {
            text-align: center !important;
            text-indent: 0 !important;
            margin: 0 !important;
        }

        .land-section {
            margin: 20px 0 !important;
            text-align: justify !important;
        }

        .land-section p {
            text-indent: 40px !important;
            margin: 15px 0 !important;
            line-height: 1.6 !important;
        }

        .land-details, .conditions {
            list-style: none !important;
            padding-left: 0 !important;
            margin: 15px 0 !important;
        }

        .land-details li, .conditions li {
            margin: 10px 0 !important;
            padding-left: 50px !important;
            text-indent: -30px !important;
            line-height: 1.6 !important;
            text-align: justify !important;
        }

        .land-details li:before, .conditions li:before {
            content: "-" !important;
            font-weight: bold !important;
            margin-right: 10px !important;
        }

        strong {
            font-weight: 700 !important;
        }

        table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 20px 0 !important;
        }

        table td, table th {
            border: 1px solid #000 !important;
            padding: 8px 12px !important;
            text-align: left !important;
            font-size: 13pt !important;
        }

        table th {
            font-weight: 700 !important;
            background-color: #f5f5f5 !important;
        }

        /* Two-column section layout */
        .two-column-section {
            margin: 20px 0 !important;
            padding: 0 !important;
            border: none !important;
            background: none !important;
            line-height: 1.6 !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 5px !important;
        }

        .section-label {
            font-weight: 700 !important;
            font-size: 14pt !important;
            flex: 0 0 auto !important;
            min-width: 120px !important;
        }

        .section-content {
            flex: 1 !important;
        }

        .content-line {
            margin: 2px 0 !important;
            line-height: 1.6 !important;
            display: inline !important;
            white-space: wrap !important;
        }

        /* Party section styles - formatted as continuous text */
        .party-section {
            margin: 20px 0 !important;
            padding: 0 !important;
            border: none !important;
            background: none !important;
            line-height: 1.6 !important;
            display: flex !important;
            align-items: baseline !important;
            gap: 5px !important;
        }

        .party-title {
            font-weight: 700 !important;
            font-size: 14pt !important;
            flex: 0 0 auto !important;
            min-width: 120px !important;
        }

        .party-content {
            flex: 1 !important;
            text-align: justify !important;
        }

        .party-form-line {
            display: inline !important;
            line-height: 1.6 !important;
        }

        .form-label {
            font-weight: 400 !important;
            display: inline !important;
        }

        .form-value {
            display: inline !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            font-weight: 400 !important;
        }

        .party-separator {
            font-weight: 600 !important;
            margin: 15px 0 !important;
            text-align: center !important;
            font-size: 14pt !important;
        }

        /* Fingerprint section styles */
        .fingerprint-section {
            margin-top: 40px !important;
            page-break-inside: avoid !important;
        }

        .fingerprint-row {
            margin-top: 30px !important;
            font-size: 0 !important;
            white-space: nowrap !important;
        }

        .fingerprint-group {
            display: inline-block !important;
            width: 24% !important;
            text-align: center !important;
            vertical-align: bottom !important;
            font-size: 12pt !important;
            margin-right: 1% !important;
        }

        .fingerprint-label {
            font-weight: 700 !important;
            margin-bottom: 20px !important;
            display: block !important;
            font-size: 12pt !important;
        }

        .fingerprint-box {
            width: 80px !important;
            height: 80px !important;
            margin: 0 auto 10px auto !important;
            display: block !important;
            border: 1px solid transparent !important;
        }

        .signature-line {
            width: 100px !important;
            height: 2px !important;
            border-bottom: 1px dotted #000 !important;
            margin: 10px auto !important;
            display: block !important;
        }

        /* Land terms section with numbered subsections */
        .land-terms-section {
            margin: 20px 0 !important;
            line-height: 1.8 !important;
        }

        .term-subsection {
            margin: 15px 0 !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 10px !important;
        }

        .term-number {
            font-weight: 700 !important;
            font-size: 14pt !important;
            flex: 0 0 auto !important;
            min-width: 40px !important;
        }

        .term-content {
            flex: 1 !important;
            text-align: justify !important;
            line-height: 1.8 !important;
        }

        .land-detail-item {
            margin: 8px 0 !important;
            padding-left: 20px !important;
            text-indent: -20px !important;
            line-height: 1.8 !important;
        }

        .sub-item {
            margin: 5px 0 !important;
            padding-left: 20px !important;
            text-indent: -20px !important;
            line-height: 1.8 !important;
        }

        /* Payment schedule section styling */
        .payment-schedule-section {
            margin: 20px 0 !important;
        }

        .payment-schedule-section .two-column-section {
            margin: 10px 0 !important;
        }

        .payment-schedule-section .section-label {
            font-weight: 700 !important;
            font-size: 14pt !important;
            min-width: 140px !important;
        }

        .payment-schedule-section .content-line {
            text-align: justify !important;
            line-height: 1.8 !important;
        }

        /* Agreement sections */
        .third-agreement-section,
        .fourth-agreement-section,
        .fifth-agreement-section,
        .sixth-agreement-section {
            margin: 10px 0 !important;
        }

        .obligation-item,
        .fault-item,
        .provision-item {
            margin: 8px 0 !important;
            text-align: justify !important;
            line-height: 1.6 !important;
        }

        p {
            margin: 12px 0 !important;
            text-align: justify !important;
            line-height: 1.6 !important;
        }

        /* Center paragraph spacing fix */
        p[style*="text-align: center"] {
            margin: 15px 0 15px 0 !important;
        }

        p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
            font-family: "Koh Santepheap", "Khmer OS", "Hanuman", serif !important;
            letter-spacing: 0.3px !important;
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
