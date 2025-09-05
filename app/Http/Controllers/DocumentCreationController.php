<?php

namespace App\Http\Controllers;

use App\Models\Buyer;
use App\Models\DocumentCreation;
use App\Models\Land;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DocumentCreationController extends Controller
{
    /**
     * Create a new deposit contract via API.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiCreateDepositContract(Request $request)
    {
        // Check if user has permission to create deposit contracts
        if (!Auth::user()->hasPermission('deposit_contracts.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $document = new DocumentCreation();
        $document->document_type = 'deposit_contract';
        $document->status = 'draft';
        // Get authenticated user ID or default to 1 if not available
        $document->creator_id = $request->user() ? $request->user()->id : 1;
        $document->save();
        
        return response()->json($document);
    }
    
    /**
     * Create a new sale contract via API.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiCreateSaleContract(Request $request)
    {
        // Check if user has permission to create sale contracts
        if (!Auth::user()->hasPermission('sale_contracts.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $document = new DocumentCreation();
        $document->document_type = 'sale_contract';
        $document->status = 'draft';
        // Get authenticated user ID or default to 1 if not available
        $document->creator_id = $request->user() ? $request->user()->id : 1;
        $document->save();
        
        return response()->json($document);
    }
    
    /**
     * Display the document type selection page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Documents/Index');
    }

    /**
     * Set document type in session and redirect to select-buyers page for deposit contract.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createDepositContract()
    {
        // Use flash session data which will persist for one request
        session()->flash('document_type', 'deposit_contract');
        return redirect()->route('deposit-contracts.select-buyers');
    }

    /**
     * Set document type in session and redirect to select-buyers page for sale contract.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createSaleContract()
    {
        // Use flash session data which will persist for one request
        session()->flash('document_type', 'sale_contract');
        return redirect()->route('sale-contracts.select-buyers');
    }

    /**
     * Display the document buyers selection page.
     *
     * @return \Inertia\Response
     */
    public function selectBuyers()
    {
        // Get document type from flash session
        $documentType = session('document_type');
        
        // If no document type in session, check the request type default
        if (!$documentType) {
            // Get the type from route defaults
            $documentType = request()->route()->defaults['type'] ?? null;
            
            // If still no document type, redirect to index
            if (!$documentType) {
                return redirect()->route('deposit-contracts.index');
            }
            
            // Convert route type format to document_type format
            if ($documentType === 'deposit_contract') {
                $documentType = 'deposit_contract';
            } else if ($documentType === 'sale_contract') {
                $documentType = 'sale_contract';
            }
        }
        
        $buyers = Buyer::all();

        return Inertia::render('Documents/SelectBuyers', [
            'buyers' => $buyers,
            'selectedBuyers' => [],
            'documentType' => $documentType,
        ]);
    }

    /**
     * Display the document sellers selection page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function selectSellers($id)
    {
        $document = DocumentCreation::findOrFail($id);
        $sellers = Seller::all();
        $selectedSellers = $document->sellers()->pluck('seller_id')->toArray();

        return Inertia::render('Documents/SelectSellers', [
            'document' => $document,
            'sellers' => $sellers,
            'selectedSellers' => $selectedSellers,
            'editMode' => session('edit_mode', false),
        ]);
    }

    /**
     * Display the document lands selection page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function selectLands($id)
    {
        $document = DocumentCreation::findOrFail($id);
        $lands = Land::all();
        $selectedLands = $document->lands()->with('land')->get()->mapWithKeys(function ($documentLand) {
            return [
                $documentLand->land_id => [
                    'land_id' => $documentLand->land_id,
                    'price_per_m2' => $documentLand->price_per_m2,
                    'total_price' => $documentLand->total_price,
                ]
            ];
        })->toArray();

        return Inertia::render('Documents/SelectLands', [
            'document' => $document,
            'lands' => $lands,
            'selectedLands' => $selectedLands,
            'editMode' => session('edit_mode', false),
        ]);
    }

    /**
     * Display the deposit configuration page for deposit contracts.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function depositConfig($id)
    {
        $document = DocumentCreation::findOrFail($id);

        if ($document->document_type !== 'deposit_contract') {
            return redirect()->route('documents.select-lands', $document->id);
        }

        return Inertia::render('Documents/DepositConfig', [
            'document' => $document,
            'editMode' => session('edit_mode', false),
        ]);
    }

    /**
     * Display the payment steps configuration page for sale contracts.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function paymentSteps($id)
    {
        $document = DocumentCreation::findOrFail($id);

        if ($document->document_type !== 'sale_contract') {
            return redirect()->route('documents.select-lands', $document->id);
        }

        $paymentSteps = $document->paymentSteps()->orderBy('step_number')->get();

        return Inertia::render('Documents/PaymentSteps', [
            'document' => $document,
            'paymentSteps' => $paymentSteps,
            'editMode' => session('edit_mode', false),
        ]);
    }

    /**
     * Display the success page after document generation.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function success($id)
    {
        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps'])
            ->findOrFail($id);

        return Inertia::render('Documents/Success', [
            'document' => $document,
        ]);
    }

    /**
     * Display the list of all documents.
     *
     * @return \Inertia\Response
     */
    public function list()
    {
        // Check if user has permission to view documents
        if (!Auth::user()->hasPermission('deposit_contracts.view') && !Auth::user()->hasPermission('sale_contracts.view')) {
            abort(403, 'Unauthorized');
        }

        $documents = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps', 'creator'])
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Documents/List', [
            'initialDocuments' => $documents,
        ]);
    }
    
    /**
     * Display the list of deposit contracts.
     *
     * @return \Inertia\Response
     */
    public function depositContractsIndex()
    {
        $documents = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps', 'creator'])
            ->where('document_type', 'deposit_contract')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Documents/DepositContractsList', [
            'initialDocuments' => $documents,
        ]);
    }
    
    /**
     * Display the list of sale contracts.
     *
     * @return \Inertia\Response
     */
    public function saleContractsIndex()
    {
        $documents = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps', 'creator'])
            ->where('document_type', 'sale_contract')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Documents/SaleContractsList', [
            'initialDocuments' => $documents,
        ]);
    }
    
    /**
     * Delete the specified document.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $document = DocumentCreation::findOrFail($id);
        
        // Check if user has permission to delete contracts
        $permissionNeeded = $document->document_type === 'deposit_contract' ? 'deposit_contracts.delete' : 'sale_contracts.delete';
        if (!Auth::user()->hasPermission($permissionNeeded)) {
            abort(403, 'Unauthorized');
        }
        
        // Use archive service to properly soft delete with relationships
        $archiveService = app(\App\Services\ArchiveService::class);
        $archiveService->archive('document_creations', $document->id);
        
        // Redirect based on document type
        if ($document->document_type === 'deposit_contract') {
            return redirect()->route('deposit-contracts.index')
                ->with('message', 'លិខិតកក់ប្រាក់ត្រូវបានលុបដោយជោគជ័យ');
        } else {
            return redirect()->route('sale-contracts.index')
                ->with('message', 'លិខិតទិញ លក់ត្រូវបានលុបដោយជោគជ័យ');
        }
    }

    /**
     * Download the document as PDF.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function download($id)
    {
        $document = DocumentCreation::findOrFail($id);
        
        // This is a placeholder for actual PDF generation
        // In a real implementation, you would generate a PDF here
        // For now, we'll just return a response indicating this is not implemented
        
        return response()->json([
            'message' => 'PDF download functionality is not implemented yet.'
        ]);
        
        // Example of how you might implement this with a PDF library:
        // $pdf = PDF::loadView('pdf.document', ['document' => $document]);
        // return $pdf->download('document-' . $document->id . '.pdf');
    }

    /**
     * Display the document details page.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps', 'creator'])
            ->findOrFail($id);

        return Inertia::render('Documents/Show', [
            'document' => $document,
        ]);
    }

    /**
     * Show the form for editing a deposit contract.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function editDepositContract($id)
    {
        // Check if user has permission to edit deposit contracts
        if (!Auth::user()->hasPermission('deposit_contracts.edit')) {
            abort(403, 'Unauthorized');
        }

        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land'])
            ->where('document_type', 'deposit_contract')
            ->findOrFail($id);

        // Store edit mode and document ID in session
        session(['edit_mode' => true, 'edit_document_id' => $id]);

        // Start the edit flow with pre-selected buyers
        $selectedBuyers = $document->buyers->pluck('buyer_id')->toArray();
        
        return Inertia::render('Documents/SelectBuyers', [
            'buyers' => Buyer::all(),
            'selectedBuyers' => $selectedBuyers,
            'documentType' => 'deposit_contract',
            'editMode' => true,
            'documentId' => $id,
        ]);
    }

    /**
     * Update a deposit contract.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateDepositContract(Request $request, $id)
    {
        // Check if user has permission to edit deposit contracts
        if (!Auth::user()->hasPermission('deposit_contracts.edit')) {
            abort(403, 'Unauthorized');
        }

        $document = DocumentCreation::where('document_type', 'deposit_contract')
            ->findOrFail($id);

        $request->validate([
            'total_land_price' => 'required|numeric|min:0',
            'deposit_amount' => 'required|numeric|min:0',
            'deposit_months' => 'required|string',
            'buyers' => 'required|array|min:1',
            'sellers' => 'required|array|min:1',
            'lands' => 'required|array|min:1',
        ]);

        // Update document fields
        $document->update([
            'total_land_price' => $request->total_land_price,
            'deposit_amount' => $request->deposit_amount,
            'deposit_months' => $request->deposit_months,
        ]);

        // Update relationships
        // Delete existing relationships
        $document->buyers()->delete();
        $document->sellers()->delete();
        $document->lands()->delete();
        
        // Create new relationships
        foreach ($request->buyers as $buyerId) {
            $document->buyers()->create(['buyer_id' => $buyerId]);
        }
        
        foreach ($request->sellers as $sellerId) {
            $document->sellers()->create(['seller_id' => $sellerId]);
        }
        
        foreach ($request->lands as $landId) {
            $document->lands()->create([
                'land_id' => $landId,
                'total_price' => 0,
                'price_per_m2' => null
            ]);
        }

        return redirect()->route('deposit-contracts.index')
            ->with('success', 'លិខិតកក់ប្រាក់ត្រូវបានកែសម្រួលដោយជោគជ័យ');
    }

    /**
     * Show the form for editing a sale contract.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function editSaleContract($id)
    {
        // Check if user has permission to edit sale contracts
        if (!Auth::user()->hasPermission('sale_contracts.edit')) {
            abort(403, 'Unauthorized');
        }

        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps'])
            ->where('document_type', 'sale_contract')
            ->findOrFail($id);

        // Check if any payment step has been paid - prevent editing if so
        $hasPaidSteps = $document->paymentSteps()->where('status', 'paid')->exists();
        if ($hasPaidSteps) {
            return redirect()->back()->with('error', 'មិនអាចកែសម្រួលកិច្ចសន្យាទិញលក់បានទេ ពីព្រោះមានដំណាក់កាលបង់ប្រាក់ដែលបានបង់រួចរាល់ហើយ។');
        }

        // Store edit mode and document ID in session
        session(['edit_mode' => true, 'edit_document_id' => $id]);

        // Start the edit flow with pre-selected buyers
        $selectedBuyers = $document->buyers->pluck('buyer_id')->toArray();
        
        return Inertia::render('Documents/SelectBuyers', [
            'buyers' => Buyer::all(),
            'selectedBuyers' => $selectedBuyers,
            'documentType' => 'sale_contract',
            'editMode' => true,
            'documentId' => $id,
        ]);
    }

    /**
     * Update a sale contract.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateSaleContract(Request $request, $id)
    {
        // Check if user has permission to edit sale contracts
        if (!Auth::user()->hasPermission('sale_contracts.edit')) {
            abort(403, 'Unauthorized');
        }

        $document = DocumentCreation::where('document_type', 'sale_contract')
            ->findOrFail($id);

        $request->validate([
            'total_land_price' => 'required|numeric|min:0',
            'buyers' => 'required|array|min:1',
            'sellers' => 'required|array|min:1',
            'lands' => 'required|array|min:1',
            'payment_steps' => 'required|array|min:1',
            'payment_steps.*.amount' => 'required|numeric|min:0',
            'payment_steps.*.due_date' => 'required|date',
            'payment_steps.*.description' => 'nullable|string',
        ]);

        // Update document fields
        $document->update([
            'total_land_price' => $request->total_land_price,
        ]);

        // Update relationships
        // Delete existing relationships
        $document->buyers()->delete();
        $document->sellers()->delete();
        $document->lands()->delete();
        
        // Create new relationships
        foreach ($request->buyers as $buyerId) {
            $document->buyers()->create(['buyer_id' => $buyerId]);
        }
        
        foreach ($request->sellers as $sellerId) {
            $document->sellers()->create(['seller_id' => $sellerId]);
        }
        
        foreach ($request->lands as $landId) {
            $document->lands()->create([
                'land_id' => $landId,
                'total_price' => 0,
                'price_per_m2' => null
            ]);
        }

        // Update payment steps
        $document->paymentSteps()->delete(); // Remove existing payment steps
        foreach ($request->payment_steps as $step) {
            $document->paymentSteps()->create([
                'amount' => $step['amount'],
                'due_date' => $step['due_date'],
                'description' => $step['description'] ?? null,
                'status' => 'unpaid',
            ]);
        }

        return redirect()->route('sale-contracts.index')
            ->with('success', 'លិខិតទិញលក់ត្រូវបានកែសម្រួលដោយជោគជ័យ');
    }
}
