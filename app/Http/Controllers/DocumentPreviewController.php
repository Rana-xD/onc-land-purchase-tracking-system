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
            'land_sale_terms_content' => $this->generateLandSaleTermsContent($document),
            'payment_schedule_content' => $this->generatePaymentScheduleContent($document),
            'third_agreement_content' => $this->generateThirdAgreementContent($document),
            'fourth_agreement_content' => $this->generateFourthAgreementContent($document),
            'fifth_agreement_content' => $this->generateFifthAgreementContent($document),
            'sixth_agreement_content' => $this->generateSixthAgreementContent($document),
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
                '0' => '០',
                '1' => '១',
                '2' => '២',
                '3' => '៣',
                '4' => '៤',
                '5' => '៥',
                '6' => '៦',
                '7' => '៧',
                '8' => '៨',
                '9' => '៩'
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
            return '<div class="party-section">
                        <div class="party-title">ភាគីអ្នកទិញ:</div>
                        <div class="party-content">
                            <div class="party-form-line"><span class="form-value">អ៊ូច ង៉ុយ</span> អាយុ <span class="form-value">៣៥</span> ឆ្នាំ</div>
                            <div class="party-form-line">មានអាសយដ្ឋាន នៅ <span class="form-value">ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ</span></div>
                            <div class="party-form-line">កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ <span class="form-value">០២០០៧៥០១៥</span> ទូរស័ព្ទលេខ <span class="form-value">០៩៨៧៦៥៤៣២</span></div>
                            <div class="party-form-line">តទៅហៅថា ភាគី"ក"</div>
                        </div>
                    </div>';
        }

        $content = '<div class="party-section">';
        $content .= '<div class="party-title">ភាគីអ្នកទិញ:</div>';
        $content .= '<div class="party-content">';

        foreach ($buyers as $index => $buyerRelation) {
            $buyer = $buyerRelation->buyer;
            $age = $this->calculateAge($buyer->date_of_birth);

            if ($index > 0) {
                $content .= '<div class="party-separator">និង</div>';
            }

            $content .= '<div class="party-form-line"><span class="form-value">' . ($buyer->name ?? '') . '</span> អាយុ <span class="form-value">' . $age . '</span> ឆ្នាំ</div>';
            $content .= '<div class="party-form-line">មានអាសយដ្ឋាន នៅ <span class="form-value">' . ($buyer->address ?? '') . '</span></div>';
            $content .= '<div class="party-form-line">កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ <span class="form-value">' . ($buyer->identity_number ?? '') . '</span> ទូរស័ព្ទលេខ <span class="form-value">' . ($buyer->phone_number ?? '') . '</span></div>';
        }

        $content .= '<div class="party-form-line">តទៅហៅថា ភាគី"ក"។</div>';
        $content .= '</div>';
        $content .= '</div>';

        return $content;
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
            return '<div class="party-section">
                        <div class="party-title">ភាគីអ្នកលក់:</div>
                        <div class="party-content">
                            <div class="party-form-line"><span class="form-value">ធន់ វាសនា</span> អាយុ <span class="form-value">៤៥</span> ឆ្នាំ</div>
                            <div class="party-form-line">មានអាសយដ្ឋាន នៅ <span class="form-value">ភូមិចុងថ្នល់ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ</span></div>
                            <div class="party-form-line">កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ <span class="form-value">០២០០៨៦០២៦</span> ទូរស័ព្ទលេខ <span class="form-value">០១២៣៤៥៦៧៨</span></div>
                            <div class="party-form-line">តទៅហៅថា ភាគី"ខ"។</div>
                        </div>
                    </div>';
        }

        $content = '<div class="party-section">';
        $content .= '<div class="party-title">ភាគីអ្នកលក់:</div>';
        $content .= '<div class="party-content">';

        foreach ($sellers as $index => $sellerRelation) {
            $seller = $sellerRelation->seller;
            $age = $this->calculateAge($seller->date_of_birth);

            if ($index > 0) {
                $content .= '<div class="party-separator">និង</div>';
            }

            $content .= '<div class="party-form-line"><span class="form-value">' . ($seller->name ?? '') . '</span> អាយុ <span class="form-value">' . $age . '</span> ឆ្នាំ</div>';
            $content .= '<div class="party-form-line">មានអាសយដ្ឋាន នៅ <span class="form-value">' . ($seller->address ?? '') . '</span></div>';
            $content .= '<div class="party-form-line">កាន់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ <span class="form-value">' . ($seller->identity_number ?? '') . '</span> ទូរស័ព្ទលេខ <span class="form-value">' . ($seller->phone_number ?? '') . '</span></div>';
        }

        $content .= '<div class="party-form-line">តទៅហៅថា ភាគី"ខ"</div>';
        $content .= '</div>';
        $content .= '</div>';

        return $content;
    }

    /**
     * Generate detailed land sale terms content with numbered sub-sections.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateLandSaleTermsContent(DocumentCreation $document)
    {
        $lands = $document->lands;
        $totalAmount = floatval($document->total_land_price ?? 0);
        $totalAmountKhmer = KhmerNumberHelper::convertCurrencyToKhmer($totalAmount);

        // Calculate land count and convert to Khmer
        $landCount = $lands->count();
        $landCountNumeric = $landCount > 0 ? $landCount : 1; // Default to 1 if no lands
        $landCountKhmer = KhmerNumberHelper::convertToKhmer($landCountNumeric);
        $landCountFormatted = sprintf('%02d', $landCountNumeric);

        $content = '<div class="land-terms-section">';

        // Section 1.1 - Land Details
        $content .= '<div class="term-subsection">';
        $content .= '<div class="term-number">១.១</div>';
        $content .= '<div class="term-content">';
        $content .= 'ភាគី "ក" យល់ព្រមលក់ដី' . $landCountFormatted . '(' . $landCountKhmer . ')កន្លែងឲ្យភាគី "ខ" ជាដីដែលមាន៖';

        if (!$lands->isEmpty()) {
            foreach ($lands as $landRelation) {
                $land = $landRelation->land;
                $landSize = floatval($landRelation->land_size ?? $land->size ?? 0);
                $landSizeKhmer = KhmerNumberHelper::convertToKhmer($landSize);

                $content .= '<div class="land-detail-item">';
                $content .= '- វិញ្ញាបនបត្រសម្គាល់ម្ចាស់អចលនវត្ថុលេខ <strong>' . ($land->plot_number ?? '') . '</strong> ';
                $content .= 'ចុះថ្ងៃទី' . ($land->issue_date ?? '') . ' ';
                $content .= 'មានទំហំ' . KhmerNumberHelper::formatNumberForDisplay($landSize) . '(' . $landSizeKhmer . ') ម៉ែត្រការ៉េ ';
                $content .= 'ស្ថិតនៅ' . ($land->location ?? '') . '។';
                $content .= '</div>';
            }
        } else {
            $content .= '<div class="land-detail-item">';
            $content .= '- វិញ្ញាបនបត្រសម្គាល់ម្ចាស់អចលនវត្ថុលេខ <strong>១២១២០៤១៧-០២១៤</strong> ';
            $content .= 'ចុះថ្ងៃទី១៥-មិថុនា-២០២០ ';
            $content .= 'មានទំហំ១៩៦៩(មួយពាន់ ប្រាំបួនរយហុកសិបប្រាំបួន) ម៉ែត្រការ៉េ ';
            $content .= 'ស្ថិតនៅភូមិចុងថ្នល់ សង្កាត់ពន្សាំង ខ័ណ្ឌព្រែកព្នៅ រាជធានីភ្នំពេញ។';
            $content .= '</div>';
        }

        $content .= '</div></div>';

        // Section 1.2 - Price Agreement
        $content .= '<div class="term-subsection">';
        $content .= '<div class="term-number">១.២</div>';
        $content .= '<div class="term-content">';
        $content .= 'ភាគី "ក" យល់ព្រមលក់ដី' . $landCountFormatted . '(' . $landCountKhmer . ')កន្លែងខាងលើ ឲ្យទៅភាគី "ខ" ';
        $content .= 'គិតជាទឹកប្រាក់សរុបស្មើនឹងចំនួន ' . KhmerNumberHelper::formatNumberForDisplay($totalAmount) . 'ដុល្លារ ';
        $content .= '(' . $totalAmountKhmer . ')។';
        $content .= '</div></div>';

        // Section 1.3 - Size Adjustment Terms
        $content .= '<div class="term-subsection">';
        $content .= '<div class="term-number">១.៣</div>';
        $content .= '<div class="term-content">';
        $content .= 'ករណីទំហំដីលើប័ណ្ណកម្មសិទ្ធិក្រោយពេលផ្ទេរមកឈ្មោះភាគី "ខ" ';
        $content .= 'មានទំហំតូចជាង ឬធំជាងទំហំដីក្នុងប្រកា១.១ ភាគី "ក" យល់ព្រមឲ្យភាគី "ខ" ';
        $content .= 'កាត់ទឹកប្រាក់ ឬបន្ថែមទឹកប្រាក់ទូទាត់ថ្លៃដីតាមទំហំដែលខ្វះ ឬលើសជាក់ស្ដែងក្នុងអត្រាតម្លៃលក់ ';
        $content .= 'តាមប្រការ ១.១ខាងលើ នៅពេលទូទាត់ប្រាក់ដំណាក់កាលទី២។';
        $content .= '</div></div>';

        // Section 1.4 - Land Loss Terms
        $content .= '<div class="term-subsection">';
        $content .= '<div class="term-number">១.៤</div>';
        $content .= '<div class="term-content">';
        $content .= 'ករណីទំហំដីជាក់ស្តែងតូចជាង ទំហំដីលើប័ណ្ណកម្មសិទ្ធិក្រោយពេលផ្ទេរមកឈ្មោះភាគី "ខ" ';
        $content .= 'ដោយសារបាត់បង់ទៅលើព្រំដីអ្នកជិតខាង ភាគី "ក" យល់ព្រមធ្វើដូចខាងក្រោម៖';
        $content .= '<div class="sub-item">- ទាមទារដីដែលបាត់នោះមកប្រគល់ឲ្យភាគី "ខ" មុនពេលទូទាត់ប្រាក់ដំណាក់កាលទី២។</div>';
        $content .= '<div class="sub-item">- ឬមិនទាមទារដីដែលបាត់នោះមកប្រគល់ឲ្យភាគី "ខ" ប៉ុន្តែយល់ព្រមឲ្យភាគី "ខ" ';
        $content .= 'កាត់ទឹកប្រាក់ទៅតាមទំហំដីដែលបាត់ ក្នុងអត្រាតម្លៃលក់ តាមប្រការ ១.១ខាងលើ ';
        $content .= 'នៅពេលទូទាត់ប្រាក់ដំណាក់កាលទី២។</div>';
        $content .= '</div></div>';

        $content .= '</div>';

        return $content;
    }

    /**
     * Generate payment schedule content with dynamic payment steps.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generatePaymentScheduleContent(DocumentCreation $document)
    {
        $paymentSchedule = $document->paymentSteps ?? collect();

        if ($paymentSchedule->isEmpty()) {
            // Return default content if no payment schedule
            return '<div class="payment-schedule-section">
                        <div class="two-column-section">
                            <div class="section-label">ដំណាក់កាលទី១ ៖</div>
                            <div class="section-content">
                                <div class="content-line">០៦ (ប្រាំមួយ) ខែក្រោយពីចុះកិច្ចសន្យា ភាគី "ខ" នឹងបង់ប្រាក់ចំនួន ១.៥០០ ដុល្លារ (មួយពាន់ប្រាំរយ ដុល្លារអាមេរិក) ជូនភាគី"ក"</div>
                            </div>
                        </div>
                    </div>';
        }

        $content = '<div class="payment-schedule-section">';

        foreach ($paymentSchedule as $index => $payment) {
            $stepNumber = $index + 1; // Start from step 1
            $stepNumberKhmer = KhmerNumberHelper::convertToKhmer($stepNumber); // Use Khmer numerals without zero padding
            $amount = floatval($payment->amount ?? 0);
            $amountKhmer = KhmerNumberHelper::convertCurrencyToKhmer($amount);

            // Generate time description based on step number
            if ($stepNumber == 1) {
                $timeDescription = $payment->payment_time_description ?? '០៦ (ប្រាំមួយ) ខែក្រោយពីចុះកិច្ចសន្យា';
            } else {
                $previousStepKhmer = KhmerNumberHelper::convertToKhmer($stepNumber - 1);
                $timeDescription = $payment->payment_time_description ?? '០៦ (ប្រាំមួយ) ខែក្រោយពីបង់ប្រាក់លើកទី' . $previousStepKhmer;
            }

            // Convert English numbers to Khmer in time description if present
            if ($timeDescription) {
                $timeDescription = preg_replace_callback('/\d+/', function($matches) {
                    return KhmerNumberHelper::convertToKhmer($matches[0]);
                }, $timeDescription);
            }

            $content .= '<div class="two-column-section">';
            $content .= '<div class="section-label">ដំណាក់កាលទី' . $stepNumberKhmer . ' ៖</div>';
            $content .= '<div class="section-content">';
            $content .= '<div class="content-line">';
            $content .= $timeDescription . ' ភាគី "ខ" នឹងបង់ប្រាក់ចំនួន ';
            $content .= KhmerNumberHelper::formatNumberForDisplay($amount) . ' ដុល្លារ ';
            $content .= '(' . $amountKhmer . ') ជូនភាគី"ក"';
            $content .= '</div>';
            $content .= '</div>';
            $content .= '</div>';
        }

        $content .= '</div>';

        return $content;
    }

    /**
     * Generate third agreement content for seller obligations.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateThirdAgreementContent(DocumentCreation $document)
    {
        $content = '<div class="third-agreement-section">';
        
        // Obligation 1 - Development rights
        $content .= '<div class="obligation-item">';
        $content .= '- ភាគី "ក" យល់ព្រមអនុញ្ញាតឲ្យភាគី "ខ" មានសិទ្ធិឈួសឆាយចាក់ដីបំពេញ បំបែកក្បាលដី បង្រួមក្បាលដី ប្ដូរប្រភេទដី ធ្វើការអភិវឌ្ឍជាបុរី និងលក់ឲ្យអតិថិជនបាន បន្ទាប់ពីភាគី "ខ" ទូទាត់ប្រាក់ដំណាក់កាលទី១ឲ្យភាគី "ក" រួចរាល់។';
        $content .= '</div>';
        
        // Obligation 2 - Transfer costs
        $content .= '<div class="obligation-item">';
        $content .= '- ភាគី "ក" ជាអ្នកចំណាយទាំងស្រុង(សេវាសុរិយោដី និងបង់ពន្ធ)សម្រាប់ការផ្ទេរកម្មសិទ្ធិ (កាត់ឈ្មោះ) មក ភាគី "ខ" ឬមកឈ្មោះដែលភាគី "ខ" ចាត់តាំង ។ ការចំណាយលើការកាត់ប្លង់ កាត់ចេញពីការទូទាត់ប្រាក់ដំណាក់កាលទី២។';
        $content .= '</div>';
        
        // Obligation 3 - Document handover
        $content .= '<div class="obligation-item">';
        $content .= '- បន្ទាប់ពីភាគី "ខ" ទូទាត់ប្រាក់ដំណាក់កាលទី១ឲ្យភាគី "ក" រួចរាល់ ភាគី "ក" ត្រូវប្រគល់ប័ណ្ណកម្មសិទ្ធិច្បាប់ដើម និងឯកសារពាក់ព័ន្ធការលក់ទិញដីនេះ ទាំងអស់ជូនភាគី "ខ" ឬមន្រ្តីសុយោដីដែលភាគី "ខ" បានសហការ សម្រាប់រៀបចំបំពេញបែបបទផ្ទេកម្មសិទ្ធិ។ បន្ទាប់ពីផ្ទេកម្មសិទ្ធិរួចភាគី "ខ" ជាអ្នកគ្រប់គ្រង វិញ្ញាបនបត្រសម្គាល់ម្ចាស់អចលនវត្ថុ ។';
        $content .= '</div>';
        
        // Obligation 4 - Legal guarantee
        $content .= '<div class="obligation-item">';
        $content .= '- ភាគី "ក" ធានាថាដីដែលជាកម្មវត្ថុនៃការលក់ទិញនេះ ពិតជាកម្មសិទ្ធិស្របច្បាប់របស់ខ្លួន និងមិនមានវិវាទ ឬជម្លោះជាមួយអ្នកណាឡើយ មិនមែនជាទ្រព្យដាក់ធានាបំណុល មិនធ្វើអំណោយឬបណ្តាំមរតក ឬមិនមានជាប់រក្សាការពារពីតុលាការ និងមិនមានផ្នូរខ្មោចឡើយ។';
        $content .= '</div>';
        
        // Obligation 5 - Third party disputes
        $content .= '<div class="obligation-item">';
        $content .= '- ភាគី "ក" ទទួលខុសត្រូវទាំងស្រុងក្នុងការដោះស្រាយ ឬចំណាយ ប្រសិនបើមានអ្នកណាមួយ (តតិយជន) មកធ្វើការតវ៉ា ឬរារាំង ឬទប់ស្កាត់មិនអាចផ្ទេកម្មសិទិ្ធមកអ្នកទិញ ឬមកឈ្មោះដែលភាគី "ខ" ចាត់តាំងបាន ។';
        $content .= '</div>';
        
        $content .= '</div>';
        
        return $content;
    }

    /**
     * Generate fourth agreement content for buyer obligations.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateFourthAgreementContent(DocumentCreation $document)
    {
        $content = '<div class="fourth-agreement-section">';
        
        // Obligation 1 - Payment obligation
        $content .= '<div class="obligation-item">';
        $content .= '- ភាគី "ខ" ត្រូវទូទាត់ប្រាក់ថ្លៃដីជូន ភាគី "ក" ដោយគ្មានការយឺតយ៉ាវតាមកាលកំណត់ដូចចែងក្នុងប្រការ ២.២ ខាងលើ ។ ករណីភាគី "ខ" ទូទាត់យឺតយ៉ាវ ភាគី "ខ" ត្រូវបង់ប្រាក់ពិន័យ១% ( មួយភាគរយ )ក្នុងមួយខែនៃប្រាក់ដែលបានបង់យឺតយាវឲ្យភាគី "ក" ។';
        $content .= '</div>';
        
        // Obligation 2 - Legal development
        $content .= '<div class="obligation-item">';
        $content .= '- ធានាធ្វើការអភិវឌ្ឍលើដីដោយស្របតាមច្បាប់ជាធរមាន។';
        $content .= '</div>';
        
        // Obligation 3 - Access facilitation
        $content .= '<div class="obligation-item">';
        $content .= '- ភាគី"ខ " ត្រូវបង្កភាពងាយស្រួលដល់ភាគី "ក" ចូលជួបនិងសាកសួពត៍មាន។';
        $content .= '</div>';
        
        $content .= '</div>';
        
        return $content;
    }

    /**
     * Generate fifth agreement content for seller and buyer faults.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateFifthAgreementContent(DocumentCreation $document)
    {
        $content = '<div class="fifth-agreement-section">';
        
        // Section 5.1 - Seller faults
        $content .= '<div class="fault-item">';
        $content .= '៥.១ កំហុសរបស់អ្នកលក់៖ ភាគី "ក" មិនអាចរំលាយកិច្ចសន្យាលក់ទិញនេះបានជាដាច់ខាត។ ករណីភាគី "ក" ចង់រំលាយកិច្ចសន្យានេះវិញ បែរជាឈប់លក់ នោះភាគី "ក" សុខចិត្តបង់សំណងស្មើរនឹង៣ដង នៃប្រាក់ដែលបានទទួល បូករួមទាំងការខូចខាតទាំងអស់ផ្សេងទៀតដែលកើតមានឡើងដោយសាកំហុសរបស់ភាគី"ក" ។';
        $content .= '</div>';
        
        // Section 5.2 - Buyer faults
        $content .= '<div class="fault-item">';
        $content .= '៥.២ កំហុសរបស់អ្នកទិញ៖ បើភាគី "ខ" ប្រែក្រលាស់ជាឈប់ទិញដីពីភាគី "ក" វិញ នោះប្រាក់កក់ និងប្រាក់ដែលភាគី "ខ" បានបង់ជូនភាគី "ក" ត្រូវទុកជាប្រយោជន៏របស់ភាគី "ក" ។';
        $content .= '</div>';
        
        $content .= '</div>';
        
        return $content;
    }

    /**
     * Generate sixth agreement content for final provisions.
     *
     * @param  DocumentCreation  $document
     * @return string
     */
    private function generateSixthAgreementContent(DocumentCreation $document)
    {
        $content = '<div class="sixth-agreement-section">';
        
        // Section 6.1 - Contract respect
        $content .= '<div class="provision-item">';
        $content .= '៦.១ - គូភាគីសន្យាគោរពយ៉ាងម៉ឺងម៉ាត់នូវរាល់ខដែលមានចែងក្នុងកិច្ចសន្យានេះ ។';
        $content .= '</div>';
        
        // Section 6.2 - Breach consequences
        $content .= '<div class="provision-item">';
        $content .= '៦.២ - ករណីមានការអនុវត្តន៏ផ្ទុយ ឬរំលោពបំពានលើលក្ខខណ្ឌណាមួយនៃកិច្ចសន្យានេះ ភាគីដែលបំពានត្រូវទទួលខុសត្រូវចំពោះមុខច្បាប់ជាធរមាន ហើយរាល់សោហ៊ុយចំណាយទាក់ទងក្នុងការដោះស្រាយវិវាទ ជាបន្ទុករបស់ភាគីដែលបានរំលោភបំពានកិច្ចសន្យានេះ ។';
        $content .= '</div>';
        
        // Section 6.3 - Contract validity and copies
        $content .= '<div class="provision-item">';
        $content .= '៦.៣ - កិច្ចសន្យានេះធ្វើឡើងដោយគូភាគីបានព្រមព្រៀងគ្នាយ៉ាងពិតប្រាកដ ពុំមានការបង្ខិតបង្ខំណាមួយឡើយ ហើយមានប្រសិទ្ទភាពអនុត្តន៏ចាប់ពីថ្ងៃចុះកិច្ចសន្យានេះតទៅ ។ កិច្ចសន្យានេះត្រូវធ្វើឡើងចំនួន០២( ពីរ )ច្បាប់ដើម ជាភាសាខ្មែរមានតម្លៃស្មើគ្នាចំពោះមុខច្បាប់ និងតម្កល់ទុកនូវគូភាគីម្នាក់មួយច្បាប់ដើម ។';
        $content .= '</div>';
        
        $content .= '</div>';
        
        return $content;
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
                $content .= '<h2 class="id-page-title">ឯកសារអត្តសញ្ញាណភាគីអ្នកទិញ - ' . $buyer->name . '</h2>';
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
                $content .= '<h2 class="id-page-title">ឯកសារអត្តសញ្ញាណភាគីអ្នកលក់ - ' . $seller->name . '</h2>';
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
