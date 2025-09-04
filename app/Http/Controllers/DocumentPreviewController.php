<?php

namespace App\Http\Controllers;

use App\Models\DocumentCreation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Services\KhmerPDFService;
use App\Services\ContractStyleService;

class DocumentPreviewController extends Controller
{
    /**
     * Display the document preview page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $document = DocumentCreation::with([
            'buyers.buyer', 
            'sellers.seller', 
            'lands.land', 
            'paymentSteps',
            'creator'
        ])->findOrFail($id);

        // Check if user has permission to view this document
        $permissionNeeded = $document->document_type === 'deposit_contract' ? 'deposit_contracts.view' : 'sale_contracts.view';
        if (!Auth::user()->hasPermission($permissionNeeded)) {
            abort(403, 'Unauthorized');
        }

        // Load and populate the template
        $populatedTemplate = $this->prepareDocument($document);

        return Inertia::render('Documents/DepositContractPreview', [
            'document' => $document,
            'populatedTemplate' => $populatedTemplate,
        ]);
    }

    /**
     * Prepare document by loading template and populating with data.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    public function prepareDocument(DocumentCreation $document)
    {
        // Select template based on document type
        $templateFile = $document->document_type === 'sale_contract' ? 'sale_contract.html' : 'deposit_contract.html';
        $templatePath = resource_path("templates/{$templateFile}");
        
        if (!file_exists($templatePath)) {
            throw new \Exception('Template file not found: ' . $templatePath);
        }

        $template = file_get_contents($templatePath);
        
        // Inject unified CSS styles into the template
        $styles = ContractStyleService::getTemplateStyles();
        $template = str_replace('{{UNIFIED_STYLES}}', $styles, $template);
        
        $data = $this->prepareTemplateData($document);

        return $this->populateTemplate($template, $data);
    }

    /**
     * Prepare template data from document.
     *
     * @param  DocumentCreation  $document
     * @return array
     */
    private function prepareTemplateData(DocumentCreation $document)
    {
        // Get first buyer and seller for main contract
        $buyer = $document->buyers->first()?->buyer;
        $seller = $document->sellers->first()?->seller;
        $land = $document->lands->first()?->land;
        $landRelation = $document->lands->first();

        // Calculate remaining amount
        $totalAmount = floatval($document->total_land_price ?? 0);
        $depositAmount = floatval($document->deposit_amount ?? 0);
        $remainingAmount = $totalAmount - $depositAmount;

        return [
            'date' => now()->format('d/m/Y'),
            'location' => 'ភ្នំពេញ',
            'seller_name' => $seller?->name ?? 'ធន់ វាសនា',
            'seller_age' => $seller?->age ?? '៤៥',
            'seller_id_number' => $seller?->identity_number ?? '០២០០៨៦០២៦',
            'seller_address' => $seller?->address ?? 'ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ',
            'seller_phone' => $seller?->phone_number ?? '០១២៣៤៥៦៧៨',
            'buyer_name' => $buyer?->name ?? 'អ៊ូច ង៉ុយ',
            'buyer_age' => $buyer?->age ?? '៣៥',
            'buyer_id_number' => $buyer?->identity_number ?? '០២០០៧៥០១៥',
            'buyer_address' => $buyer?->address ?? 'ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ',
            'buyer_phone' => $buyer?->phone_number ?? '០៩៨៧៦៥៤៣២',
            'land_location' => $land?->location ?? 'ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ',
            'land_size' => number_format($land?->size ?? 1969),
            'land_plot_number' => $land?->plot_number ?? 'ក-១២៣៤',
            'land_price' => number_format($landRelation?->price_per_m2 ?? 30.5, 2),
            'total_amount' => number_format($totalAmount, 2),
            'deposit_amount' => number_format($depositAmount, 2),
            'remaining_amount' => number_format($remainingAmount, 2),
            'deposit_months' => $document->deposit_months ?? 3,
            'payment_schedule_table' => $this->generatePaymentScheduleTable($document),
            'witness_1' => 'លី សុខា',
            'witness_2' => 'ចាន់ ពិសាច',
            'creation_date' => $document->created_at->format('d/m/Y H:i'),
            'creator_name' => $document->creator?->name ?? 'ប្រព័ន្ធ',
        ];
    }

    /**
     * Generate payment schedule table HTML.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generatePaymentScheduleTable(DocumentCreation $document)
    {
        $html = '<table class="payment-table">';
        $html .= '<thead>';
        $html .= '<tr>';
        $html .= '<th>ល.រ</th>';
        $html .= '<th>ការបង់ប្រាក់</th>';
        $html .= '<th>ចំនួនទឹកប្រាក់</th>';
        $html .= '<th>កាលបរិច្ឆេទ</th>';
        $html .= '<th>ស្ថានភាព</th>';
        $html .= '</tr>';
        $html .= '</thead>';
        $html .= '<tbody>';
        
        // Add deposit payment row
        $html .= '<tr>';
        $html .= '<td>១</td>';
        $html .= '<td>ប្រាក់កក់</td>';
        $html .= '<td>$' . number_format(floatval($document->deposit_amount ?? 0), 2) . '</td>';
        $html .= '<td>' . now()->format('d/m/Y') . '</td>';
        $html .= '<td style="color: #52c41a; font-weight: bold;">បានបង់</td>';
        $html .= '</tr>';
        
        // Add remaining payment row
        $totalAmount = floatval($document->total_land_price ?? 0);
        $depositAmount = floatval($document->deposit_amount ?? 0);
        $remainingAmount = $totalAmount - $depositAmount;
        
        if ($remainingAmount > 0) {
            $dueDate = now()->addMonths($document->deposit_months ?? 3);
            $html .= '<tr>';
            $html .= '<td>២</td>';
            $html .= '<td>ប្រាក់នៅសល់</td>';
            $html .= '<td>$' . number_format($remainingAmount, 2) . '</td>';
            $html .= '<td>' . $dueDate->format('d/m/Y') . '</td>';
            $html .= '<td style="color: #faad14; font-weight: bold;">មិនទាន់បង់</td>';
            $html .= '</tr>';
        }
        
        $html .= '</tbody>';
        $html .= '</table>';
        
        return $html;
    }

    /**
     * Populate template with data.
     *
     * @param  string  $template
     * @param  array  $data
     * @return string
     */
    private function populateTemplate($template, $data)
    {
        foreach ($data as $key => $value) {
            $template = str_replace('{{' . $key . '}}', $value, $template);
        }
        
        return $template;
    }

    /**
     * Save edited document content.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $request, $id)
    {
        $document = DocumentCreation::findOrFail($id);
        
        // Check if user has permission to edit this document
        $permissionNeeded = $document->document_type === 'deposit_contract' ? 'deposit_contracts.edit' : 'sale_contracts.edit';
        if (!Auth::user()->hasPermission($permissionNeeded)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        // Save the edited content to document
        $document->update([
            'document_content' => $request->content,
            'status' => 'draft',
        ]);

        return response()->json([
            'message' => 'Document saved successfully',
            'document' => $document,
        ]);
    }

    /**
     * Generate PDF from document using Browsershot for perfect Khmer rendering.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function generatePDF(Request $request, $id)
    {
        $document = DocumentCreation::findOrFail($id);
        
        // Check if user has permission to generate PDF
        $permissionNeeded = $document->document_type === 'deposit_contract' ? 'deposit_contracts.view' : 'sale_contracts.view';
        if (!Auth::user()->hasPermission($permissionNeeded)) {
            return response()->json(['message' => 'មិនមានសិទ្ធិក្នុងការបង្កើត PDF'], 403);
        }

        try {
            // Get content - either edited content or generate from template
            $content = $document->document_content ?? $this->prepareDocument($document);
            
            // If content was provided in request (from editor), use that
            if ($request->has('content')) {
                $content = $request->content;
                // Save the final content
                $document->update([
                    'document_content' => $content,
                    'status' => 'completed',
                ]);
            }

            // Generate PDF using KhmerPDFService with Browsershot
            $pdfService = new KhmerPDFService();
            $contractType = $document->document_type; // 'deposit_contract' or 'sale_contract'
            $filename = $contractType . '_' . $document->id . '_' . now()->format('Y_m_d_H_i_s') . '.pdf';
            
            return $pdfService->generateAndDownload($content, $filename, $contractType);
            
        } catch (\Exception $e) {
            Log::error('PDF Generation Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'មានបញ្ហាក្នុងការបង្កើត PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test Khmer PDF generation.
     *
     * @return \Illuminate\Http\Response
     */
    public function testKhmerPDF()
    {
        try {
            $pdfService = new KhmerPDFService();
            $testContent = $pdfService->getKhmerTestContent();
            $filename = 'khmer_test_' . now()->format('Y_m_d_H_i_s') . '.pdf';
            
            return $pdfService->generateAndDownload($testContent, $filename);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'ការធ្វើតេស្ត PDF បរាជ័យ: ' . $e->getMessage()
            ], 500);
        }
    }
}
