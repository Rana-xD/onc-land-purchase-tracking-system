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
        $selectedLands = $document->lands()->with('land')->get()->map(function ($documentLand) {
            return [
                'land_id' => $documentLand->land_id,
                'price_per_m2' => $documentLand->price_per_m2,
                'total_price' => $documentLand->total_price,
            ];
        })->keyBy('land_id')->toArray();

        return Inertia::render('Documents/SelectLands', [
            'document' => $document,
            'lands' => $lands,
            'selectedLands' => $selectedLands,
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
        
        // Delete related records first
        $document->buyers()->delete();
        $document->sellers()->delete();
        $document->lands()->delete();
        $document->paymentSteps()->delete();
        
        // Delete the document itself
        $document->delete();
        
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
}
