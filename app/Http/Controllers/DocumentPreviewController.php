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
use App\Helpers\KhmerNumberHelper;

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

        // Render appropriate component based on document type
        $componentName = $document->document_type === 'sale_contract' 
            ? 'Documents/SaleContractPreview' 
            : 'Documents/DepositContractPreview';
            
        return Inertia::render($componentName, [
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
        
        // Ensure template is UTF-8 encoded
        if (!mb_check_encoding($template, 'UTF-8')) {
            $template = mb_convert_encoding($template, 'UTF-8', 'auto');
        }
        
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
        // Get first buyer and seller for main contract (for backward compatibility)
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
            // Legacy individual fields (kept for backward compatibility)
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
            // New dynamic content generation
            'buyers_content' => $this->generateBuyersContent($document),
            'sellers_content' => $this->generateSellersContent($document),
            'lands_content' => $this->generateLandsContent($document),
            'deposit_content' => $this->generateDepositContent($document),
            'deposit_terms_content' => $this->generateDepositTermsContent($document),
            'current_date' => KhmerNumberHelper::convertDateToKhmer(now()),
            'land_location' => $land?->location ?? 'ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ',
            'land_size' => number_format($land?->size ?? 1969),
            'land_plot_number' => $land?->plot_number ?? 'ក-១២៣៤',
            'land_price' => number_format($landRelation?->price_per_m2 ?? 30.5, 2),
            // Khmer number conversions
            'deposit_amount_khmer' => KhmerNumberHelper::convertCurrencyToKhmer($depositAmount),
            'total_amount_khmer' => KhmerNumberHelper::convertCurrencyToKhmer($totalAmount),
            'remaining_amount_khmer' => KhmerNumberHelper::convertCurrencyToKhmer($remainingAmount),
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
     * Calculate age from date of birth.
     *
     * @param  string|null  $dateOfBirth
     * @return string
     */
    private function calculateAge($dateOfBirth)
    {
        if (!$dateOfBirth) {
            return '';
        }
        
        try {
            $birthDate = new \DateTime($dateOfBirth);
            $today = new \DateTime();
            $age = $today->diff($birthDate)->y;
            
            // Convert to Khmer numerals
            $khmerNumerals = [
                '0' => '០', '1' => '១', '2' => '២', '3' => '៣', '4' => '៤',
                '5' => '៥', '6' => '៦', '7' => '៧', '8' => '៨', '9' => '៩'
            ];
            
            return strtr((string)$age, $khmerNumerals);
        } catch (\Exception $e) {
            return '';
        }
    }

    /**
     * Generate buyers content with multiple buyers support.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateBuyersContent(DocumentCreation $document)
    {
        $buyers = $document->buyers;
        
        if ($buyers->isEmpty()) {
            // Fallback content if no buyers
            return '<p>យើងខ្ញុំ ឈ្មោះ អ៊ូច ង៉ុយ អាយុ ៣៥ ឆ្នាំ មានអាសយដ្ឋាន នៅ ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ ០២០០៧៥០១៥ ទូរស័ព្ទលេខ ០៩៨៧៦៥៤៣២ តទៅហៅថា ភាគី"ក" ។</p>';
        }
        
        $buyerTexts = [];
        foreach ($buyers as $buyerRelation) {
            $buyer = $buyerRelation->buyer;
            $age = $this->calculateAge($buyer->date_of_birth);
            
            $buyerTexts[] = 'យើងខ្ញុំ ឈ្មោះ ' . ($buyer->name ?? '') . 
                           ' អាយុ ' . $age . 
                           ' ឆ្នាំ មានអាសយដ្ឋាន នៅ ' . ($buyer->address ?? '') . 
                           ' កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ ' . ($buyer->identity_number ?? '') . 
                           ' ទូរស័ព្ទលេខ ' . ($buyer->phone_number ?? '');
        }
        
        return '<p>' . implode(' និង ', $buyerTexts) . ' តទៅហៅថា ភាគី"ក" ។</p>';
    }

    /**
     * Generate sellers content with multiple sellers support.
     *
     * @return string
     */
    private function generateSellersContent(DocumentCreation $document)
    {
        $sellers = $document->sellers;
        
        if ($sellers->isEmpty()) {
            // Fallback content if no sellers
            return '<p>យើងខ្ញុំ ឈ្មោះ ធន់ វាសនា អាយុ ៤៥ ឆ្នាំ មានអាសយដ្ឋាន នៅ ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ ០២០០៨៦០២៦ ទូរស័ព្ទលេខ ០១២៣៤៥៦៧៨ តទៅហៅថា ភាគី"ខ" ។</p>';
        }
        
        $sellerTexts = [];
        foreach ($sellers as $sellerRelation) {
            $seller = $sellerRelation->seller;
            $age = $this->calculateAge($seller->date_of_birth);
            
            $sellerTexts[] = 'យើងខ្ញុំ ឈ្មោះ ' . ($seller->name ?? '') . 
                           ' អាយុ ' . $age . 
                           ' ឆ្នាំ មានអាសយដ្ឋាន នៅ ' . ($seller->address ?? '') . 
                           ' កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ ' . ($seller->identity_number ?? '') . 
                           ' ទូរស័ព្ទលេខ ' . ($seller->phone_number ?? '');
        }
        
        return '<p>' . implode(' និង ', $sellerTexts) . ' តទៅហៅថា ភាគី"ខ" ។</p>';
    }

    /**
     * Generate lands content with multiple lands support and Khmer number conversion.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateLandsContent(DocumentCreation $document)
    {
        $lands = $document->lands;
        
        if ($lands->isEmpty()) {
            // Fallback content if no lands
            return '<li>ដីដែលមានវីញ្ញាបនបត្រសម្គាល់ម្ចាស់អចលនវត្ថុលេខ ក-១២៣៤ មានទំហំ ១៩៦៩ (មួយពាន់កៅរយហុកសិបប្រាំបួន ម៉ែត្រការ៉េ) មានទីតាំងស្ងិតនៅ ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ ក្នុងតំលៃ USD ៦០០០០ ជាអក្សរ (ហុកមុឺនដុល្លារ) ។</li>';
        }
        
        $landTexts = [];
        foreach ($lands as $landRelation) {
            $land = $landRelation->land;
            $landSize = $land->size ?? 0;
            $landPrice = $landRelation->total_price ?? 0;
            
            // Convert numbers to Khmer text
            $landSizeKhmer = KhmerNumberHelper::convertToKhmer($landSize);
            $landPriceKhmer = KhmerNumberHelper::convertCurrencyToKhmer($landPrice);
            
            $landTexts[] = 'ដីដែលមានវីញ្ញាបនបត្រសម្គាល់ម្ចាស់អចលនវត្ថុលេខ ' . ($land->plot_number ?? '') .
                          ' មានទំហំ ' . KhmerNumberHelper::formatNumberForDisplay($landSize) .
                          ' (' . $landSizeKhmer . ' ម៉ែត្រការ៉េ)' .
                          ' មានទីតាំងស្ងិតនៅ ' . ($land->location ?? '') .
                          ' ក្នុងតំលៃ USD ' . KhmerNumberHelper::formatNumberForDisplay($landPrice) .
                          ' ជាអក្សរ (' . $landPriceKhmer . ') ។';
        }
        
        // Join multiple lands with 'និង' and wrap each in <li> tags
        $joinedLands = implode('</li><li>', $landTexts);
        return '<li>' . $joinedLands . '</li>';
    }

    /**
     * Generate deposit content with dynamic deposit amount and Khmer conversion.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateDepositContent(DocumentCreation $document)
    {
        $depositAmount = floatval($document->deposit_amount ?? 0);
        $depositAmountKhmer = KhmerNumberHelper::convertCurrencyToKhmer($depositAmount);
        
        if ($depositAmount == 0) {
            // Fallback content if no deposit amount
            return '<p>ភាគី "ខ" យល់ព្រមទទួលប្រាក់ទ្រនាប់ដៃចំនូន USD ០(សូន្យដុល្លារ)តាមរយៈសាច់ប្រាក់សុទ្ធ ពី ភាគី ក សម្រាប់ការព្រមព្រៀងទិញលក់ដីដូចខាងក្រោម៖</p>';
        }
        
        return '<p class="indent-text">ភាគី "ខ" យល់ព្រមទទួលប្រាក់ទ្រនាប់ដៃចំនូន USD ' . 
               KhmerNumberHelper::formatNumberForDisplay($depositAmount) . '(' . $depositAmountKhmer . ')' .
               'តាមរយៈសាច់ប្រាក់សុទ្ធ ពី ភាគី "ក" សម្រាប់ការព្រមព្រៀងទិញលក់ដីដូចខាងក្រោម៖</p>';
    }

    /**
     * Generate deposit terms content with dynamic deposit period calculation.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateDepositTermsContent(DocumentCreation $document)
    {
        // Use the deposit_months field which now stores the full period string like "2 សប្តាហ៍"
        $depositPeriod = $document->deposit_months ?? '3 ខែ'; // Default to 3 months
        
        // Calculate deposit expiry date
        $depositExpiryDate = KhmerNumberHelper::addPeriodToDate(now(), $depositPeriod);
        
        return '<p class="indent-text">ប្រាក់កក់នេះមានសុពលភាពយ៉ាងយូរហូតដល់ ' . $depositExpiryDate . ' ។ បើដល់' . $depositExpiryDate . 'ភាគីអ្នកទិញមិនបានមកធ្វើកិច្ចសន្យាទិញលក់ទេគឺចាត់ទុកជាអសារបង់។ប៉ុន្តែបើភាគីអ្នកលក់កែប្រែមិនលក់វិញត្រូវសង ១x៣(មួយគុណបី)ដងនៃទឹកប្រាក់ដែលបានបង់ទៅអោយអ្នកទិញវិញ។</p>' .
               '<p class="indent-text">គូភាគីបានអាន ស្តាប់ និងយល់នូវខ្លឺមសារនៃកិច្ចសន្យានេះយ៉ាងច្បាស់លាស់ ដោយភាគីទាំងពីរយល់ព្រមផ្តិតស្នាមមេដៃ និងចុះហត្ថលេខាលើកិច្ចសន្យានេះ ទុកជាភស្តុតាង។</p>';
    }

    /**
     * Generate buyer ID pages with front and back images side by side.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateBuyerIdPages(DocumentCreation $document)
    {
        $content = '';
        $buyers = $document->buyers;
        
        foreach ($buyers as $documentBuyer) {
            $buyer = $documentBuyer->buyer;
            if ($buyer->front_image_path || $buyer->back_image_path) {
                $content .= '<div class="page-break">';
                $content .= '<div class="id-page-header">';
                $content .= '<h2 class="id-page-title">ឯកសារអត្តសញ្ញាណភាគីទិញ - ' . $buyer->name . '</h2>';
                $content .= '</div>';
                
                $content .= '<div class="id-images-container">';
                
                // Back image on left
                if ($buyer->back_image_path) {
                    $backImagePath = storage_path('app/public/' . $buyer->back_image_path);
                    Log::info('[DocumentPreview] Back image path check', [
                        'buyer_id' => $buyer->id,
                        'db_path' => $buyer->back_image_path,
                        'full_path' => $backImagePath,
                        'file_exists' => file_exists($backImagePath)
                    ]);
                    if (file_exists($backImagePath)) {
                        $imageData = base64_encode(file_get_contents($backImagePath));
                        $imageMime = mime_content_type($backImagePath);
                        $content .= '<div class="id-image-half">';
                        $content .= '<h3 class="image-label">ខាងក្រោយ</h3>';
                        $content .= '<img src="data:' . $imageMime . ';base64,' . $imageData . '" alt="Back ID" class="id-image">';
                        $content .= '</div>';
                        Log::info('[DocumentPreview] Back image processed successfully');
                    } else {
                        Log::warning('[DocumentPreview] Back image file not found: ' . $backImagePath);
                    }
                }
                
                // Front image on right
                if ($buyer->front_image_path) {
                    $frontImagePath = storage_path('app/public/' . $buyer->front_image_path);
                    if (file_exists($frontImagePath)) {
                        $imageData = base64_encode(file_get_contents($frontImagePath));
                        $imageMime = mime_content_type($frontImagePath);
                        $content .= '<div class="id-image-half">';
                        $content .= '<h3 class="image-label">ខាងមុខ</h3>';
                        $content .= '<img src="data:' . $imageMime . ';base64,' . $imageData . '" alt="Front ID" class="id-image">';
                        $content .= '</div>';
                    }
                }
                
                $content .= '</div>'; // Close id-images-container
                $content .= '</div>'; // Close page-break
            }
        }
        
        return $content;
    }

    /**
     * Generate seller ID pages with front and back images side by side.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateSellerIdPages(DocumentCreation $document)
    {
        $content = '';
        $sellers = $document->sellers;
        
        foreach ($sellers as $documentSeller) {
            $seller = $documentSeller->seller;
            if ($seller->front_image_path || $seller->back_image_path) {
                $content .= '<div class="page-break">';
                $content .= '<div class="id-page-header">';
                $content .= '<h2 class="id-page-title">ឯកសារអត្តសញ្ញាណភាគីលក់ - ' . $seller->name . '</h2>';
                $content .= '</div>';
                
                $content .= '<div class="id-images-container">';
                
                // Back image on left
                if ($seller->back_image_path) {
                    $backImagePath = storage_path('app/public/' . $seller->back_image_path);
                    if (file_exists($backImagePath)) {
                        $imageData = base64_encode(file_get_contents($backImagePath));
                        $imageMime = mime_content_type($backImagePath);
                        $content .= '<div class="id-image-half">';
                        $content .= '<h3 class="image-label">ខាងក្រោយ</h3>';
                        $content .= '<img src="data:' . $imageMime . ';base64,' . $imageData . '" alt="Back ID" class="id-image">';
                        $content .= '</div>';
                    }
                }
                
                // Front image on right
                if ($seller->front_image_path) {
                    $frontImagePath = storage_path('app/public/' . $seller->front_image_path);
                    if (file_exists($frontImagePath)) {
                        $imageData = base64_encode(file_get_contents($frontImagePath));
                        $imageMime = mime_content_type($frontImagePath);
                        $content .= '<div class="id-image-half">';
                        $content .= '<h3 class="image-label">ខាងមុខ</h3>';
                        $content .= '<img src="data:' . $imageMime . ';base64,' . $imageData . '" alt="Front ID" class="id-image">';
                        $content .= '</div>';
                    }
                }
                
                $content .= '</div>'; // Close id-images-container
                $content .= '</div>'; // Close page-break
            }
        }
        
        return $content;
    }

    /**
     * Generate land document pages with full page front and back images.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateLandDocumentPages(DocumentCreation $document)
    {
        $content = '';
        $lands = $document->lands;
        
        foreach ($lands as $documentLand) {
            $land = $documentLand->land;
            if ($land->front_image_path || $land->back_image_path) {
                // Front page
                if ($land->front_image_path) {
                    $frontImagePath = storage_path('app/public/' . $land->front_image_path);
                    if (file_exists($frontImagePath)) {
                        $imageData = base64_encode(file_get_contents($frontImagePath));
                        $imageMime = mime_content_type($frontImagePath);
                        $content .= '<div class="page-break">';
                        $content .= '<div class="land-page-header">';
                        $content .= '<h2 class="land-page-title">ឯកសារដី - ' . $land->plot_number . ' (ខាងមុខ)</h2>';
                        $content .= '</div>';
                        $content .= '<div class="land-image-container">';
                        $content .= '<img src="data:' . $imageMime . ';base64,' . $imageData . '" alt="Land Document Front" class="land-image-full">';
                        $content .= '</div>';
                        $content .= '</div>';
                    }
                }
                
                // Back page
                if ($land->back_image_path) {
                    $backImagePath = storage_path('app/public/' . $land->back_image_path);
                    if (file_exists($backImagePath)) {
                        $imageData = base64_encode(file_get_contents($backImagePath));
                        $imageMime = mime_content_type($backImagePath);
                        $content .= '<div class="page-break">';
                        $content .= '<div class="land-page-header">';
                        $content .= '<h2 class="land-page-title">ឯកសារដី - ' . $land->plot_number . ' (ខាងក្រោយ)</h2>';
                        $content .= '</div>';
                        $content .= '<div class="land-image-container">';
                        $content .= '<img src="data:' . $imageMime . ';base64,' . $imageData . '" alt="Land Document Back" class="land-image-full">';
                        $content .= '</div>';
                        $content .= '</div>';
                    }
                }
            }
        }
        
        return $content;
    }

    /**
     * Append image pages to document content.
     *
     * @param  string  $content
     * @param  DocumentCreation  $document
     * @return string
     */
    private function appendImagePages($content, DocumentCreation $document)
    {
        // Generate all image pages
        $buyerIdPages = $this->generateBuyerIdPages($document);
        $sellerIdPages = $this->generateSellerIdPages($document);
        $landDocumentPages = $this->generateLandDocumentPages($document);
        
        // Append image pages to the main content
        $content .= $buyerIdPages;
        $content .= $sellerIdPages;
        $content .= $landDocumentPages;
        
        return $content;
    }

    /**
     * Generate payment schedule table HTML.
     *
{{ ... }}
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
            // Ensure value is UTF-8 encoded
            if (is_string($value) && !mb_check_encoding($value, 'UTF-8')) {
                $value = mb_convert_encoding($value, 'UTF-8', 'auto');
            }
            $template = str_replace('{{' . $key . '}}', $value, $template);
        }
        
        // Ensure final template is UTF-8 encoded
        if (!mb_check_encoding($template, 'UTF-8')) {
            $template = mb_convert_encoding($template, 'UTF-8', 'auto');
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
        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land'])->findOrFail($id);
        
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
     * Generate PDF and return for printing.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function printPDF($id)
    {
        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land'])->findOrFail($id);
        
        // Check if user is authenticated
        if (!Auth::check()) {
            abort(403, 'Unauthorized');
        }

        try {
            // Prepare document content
            $html = $this->prepareDocument($document);
            
            // Generate PDF using KhmerPDFService
            $pdfService = new \App\Services\KhmerPDFService();
            $filename = $document->document_type . '_' . $document->id . '_print.pdf';
            $pdfPath = $pdfService->generateFromHTML($html, $filename, $document->document_type);
            
            // Return PDF for inline display (opens in browser for printing)
            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $filename . '"'
            ]);
            
        } catch (\Exception $e) {
            abort(500, 'PDF generation failed: ' . $e->getMessage());
        }
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
        $document = DocumentCreation::with([
            'buyers.buyer', 
            'sellers.seller', 
            'lands.land'
        ])->findOrFail($id);
        
        // Check if user has permission to generate PDF
        $permissionNeeded = $document->document_type === 'deposit_contract' ? 'deposit_contracts.view' : 'sale_contracts.view';
        if (!Auth::user()->hasPermission($permissionNeeded)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            // Get content from request (edited content) or use default template
            $content = $request->input('content');
            
            if (!$content) {
                // If no content provided, use the default template
                $content = $this->prepareDocument($document);
            }
            
            // Append image pages to the document content
            // $content = $this->appendImagePages($content, $document);
            
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
