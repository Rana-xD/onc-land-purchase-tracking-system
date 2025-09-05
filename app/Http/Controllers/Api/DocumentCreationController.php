<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buyer;
use App\Models\DocumentBuyer;
use App\Models\DocumentCreation;
use App\Models\DocumentLand;
use App\Models\DocumentSeller;
use App\Models\Land;
use App\Models\PaymentStep;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class DocumentCreationController extends Controller
{
    /**
     * Create a new deposit contract document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiCreateDepositContract(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_type' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::create([
            'document_type' => 'deposit_contract',
            'created_by' => $request->user()->id,
            'status' => 'draft',
        ]);

        return response()->json($document, 201);
    }
    
    /**
     * Create a new sale contract document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiCreateSaleContract(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_type' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::create([
            'document_type' => 'sale_contract',
            'created_by' => $request->user()->id,
            'status' => 'draft',
        ]);

        return response()->json($document, 201);
    }
    
    /**
     * Create a new document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_type' => 'required|in:deposit_contract,sale_contract',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::create([
            'document_type' => $request->document_type,
            'created_by' => $request->user()->id,
            'status' => 'draft',
        ]);

        return response()->json($document, 201);
    }

    /**
     * Select buyers for the document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function selectBuyers(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'buyer_ids' => 'required|array|min:1',
            'buyer_ids.*' => 'exists:buyers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::findOrFail($id);

        // Delete existing buyers
        $document->buyers()->delete();

        // Add new buyers
        foreach ($request->buyer_ids as $buyerId) {
            DocumentBuyer::create([
                'document_creation_id' => $document->id,
                'buyer_id' => $buyerId,
            ]);
        }

        return response()->json(['message' => 'Buyers selected successfully']);
    }

    /**
     * Select sellers for the document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function selectSellers(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'seller_ids' => 'required|array|min:1',
            'seller_ids.*' => 'exists:sellers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::findOrFail($id);

        // Delete existing sellers
        $document->sellers()->delete();

        // Add new sellers
        foreach ($request->seller_ids as $sellerId) {
            DocumentSeller::create([
                'document_creation_id' => $document->id,
                'seller_id' => $sellerId,
            ]);
        }

        return response()->json(['message' => 'Sellers selected successfully']);
    }

    /**
     * Select lands with pricing for the document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function selectLands(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'lands' => 'required|array|min:1',
            'lands.*.land_id' => 'required|exists:lands,id',
            'lands.*.price_per_m2' => 'nullable|numeric|min:0',
            'lands.*.total_price' => 'required_without:lands.*.price_per_m2|nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::findOrFail($id);

        // Delete existing lands
        $document->lands()->delete();

        $totalLandPrice = 0;

        // Add new lands with pricing
        foreach ($request->lands as $landData) {
            $land = Land::findOrFail($landData['land_id']);
            $pricePerM2 = $landData['price_per_m2'] ?? null;
            $totalPrice = $landData['total_price'] ?? null;

            // Calculate total price if price_per_m2 is provided
            if ($pricePerM2) {
                $totalPrice = $land->size * $pricePerM2;
            }

            DocumentLand::create([
                'document_creation_id' => $document->id,
                'land_id' => $land->id,
                'price_per_m2' => $pricePerM2,
                'total_price' => $totalPrice,
            ]);

            $totalLandPrice += $totalPrice;
        }

        // Update the document with the total land price
        $document->update(['total_land_price' => $totalLandPrice]);

        return response()->json([
            'message' => 'Lands selected successfully',
            'total_land_price' => $totalLandPrice
        ]);
    }

    /**
     * Configure deposit for deposit contract.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function depositConfig(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'deposit_amount' => 'required|numeric|min:0',
            'deposit_months' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::findOrFail($id);

        if ($document->document_type !== 'deposit_contract') {
            return response()->json(['error' => 'This operation is only valid for deposit contracts'], 422);
        }

        $document->update([
            'deposit_amount' => $request->deposit_amount,
            'deposit_months' => $request->deposit_months,
        ]);

        return response()->json(['message' => 'Deposit configuration saved successfully']);
    }

    /**
     * Configure payment steps for sale contract.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function paymentSteps(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_steps' => 'required|array|min:1',
            'payment_steps.*.amount' => 'required|numeric|min:0',
            'payment_steps.*.due_date' => 'required|date',
            'payment_steps.*.payment_time_description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $document = DocumentCreation::findOrFail($id);

        if ($document->document_type !== 'sale_contract') {
            return response()->json(['error' => 'This operation is only valid for sale contracts'], 422);
        }

        // Calculate total payment amount
        $paymentTotal = array_sum(array_column($request->payment_steps, 'amount'));

        // Validate that payment total equals land price total
        if (abs($paymentTotal - $document->total_land_price) > 0.01) {
            return response()->json([
                'error' => 'Payment steps total must equal land price total',
                'payment_total' => $paymentTotal,
                'land_price_total' => $document->total_land_price
            ], 422);
        }

        // Delete existing payment steps
        $document->paymentSteps()->delete();

        // Add new payment steps
        foreach ($request->payment_steps as $index => $stepData) {
            PaymentStep::create([
                'document_creation_id' => $document->id,
                'step_number' => $index + 1,
                'payment_time_description' => $stepData['payment_time_description'] ?? 'ដំណាក់កាលទី ' . ($index + 1),
                'amount' => $stepData['amount'],
                'due_date' => $stepData['due_date'],
            ]);
        }

        return response()->json(['message' => 'Payment steps saved successfully']);
    }

    /**
     * Generate the document.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function generate($id)
    {
        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps'])
            ->findOrFail($id);

        // Validate document has required data
        if ($document->buyers()->count() === 0) {
            return response()->json(['error' => 'Document must have at least one buyer'], 422);
        }

        if ($document->sellers()->count() === 0) {
            return response()->json(['error' => 'Document must have at least one seller'], 422);
        }

        if ($document->lands()->count() === 0) {
            return response()->json(['error' => 'Document must have at least one land'], 422);
        }

        // Additional validation based on document type
        if ($document->isDepositContract()) {
            if (!$document->deposit_amount || !$document->deposit_months) {
                return response()->json(['error' => 'Deposit contract requires deposit amount and months'], 422);
            }
        } else if ($document->isSaleContract()) {
            if ($document->paymentSteps()->count() === 0) {
                return response()->json(['error' => 'Sale contract requires payment steps'], 422);
            }
        }

        // Mark document as completed
        $document->update(['status' => 'completed']);

        // If this is a sale contract, create a SaleContract record
        if ($document->isSaleContract()) {
            // Get the first buyer, seller, and land for the contract details
            $firstBuyer = $document->buyers()->with('buyer')->first();
            $firstSeller = $document->sellers()->with('seller')->first();
            $firstLand = $document->lands()->with('land')->first();
            
            // Create the sale contract record
            $saleContract = new \App\Models\SaleContract([
                'contract_id' => $document->document_code,
                'document_creation_id' => $document->id,
                'land_id' => $firstLand ? $firstLand->land_id : null,
                'buyer_name' => $firstBuyer ? $firstBuyer->buyer->name : 'Unknown',
                'buyer_phone' => $firstBuyer ? $firstBuyer->buyer->phone : 'Unknown',
                'buyer_address' => $firstBuyer ? $firstBuyer->buyer->address : 'Unknown',
                'seller_name' => $firstSeller ? $firstSeller->seller->name : 'Unknown',
                'seller_phone' => $firstSeller ? $firstSeller->seller->phone : 'Unknown',
                'seller_address' => $firstSeller ? $firstSeller->seller->address : 'Unknown',
                'total_amount' => $document->total_land_price,
                'contract_date' => now(),
                'status' => 'active',
            ]);
            
            $saleContract->save();
        }

        // In a real implementation, you would generate the actual document here
        // For now, we'll just return the document data

        return response()->json([
            'message' => 'Document generated successfully',
            'document' => $document
        ]);
    }

    /**
     * Get all documents with optional filtering by type.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps', 'creator']);
        
        // Filter by document type if provided
        if ($request->has('type')) {
            $query->where('document_type', $request->type);
        }
        
        $documents = $query->orderBy('created_at', 'desc')
            ->get();

        return response()->json($documents);
    }

    /**
     * Get a specific document.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $document = DocumentCreation::with(['buyers.buyer', 'sellers.seller', 'lands.land', 'paymentSteps'])
            ->findOrFail($id);

        return response()->json($document);
    }
}
