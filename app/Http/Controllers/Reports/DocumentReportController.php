<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\SaleContract;
use App\Services\Reports\ContractSearchService;
use App\Services\Reports\DocumentExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DocumentReportController extends Controller
{
    protected $contractSearchService;
    protected $documentExportService;

    public function __construct(
        ContractSearchService $contractSearchService,
        DocumentExportService $documentExportService
    ) {
        $this->contractSearchService = $contractSearchService;
        $this->documentExportService = $documentExportService;
    }

    /**
     * Get all contracts with pagination
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $contracts = SaleContract::with(['land', 'documentCreation.buyers', 'documentCreation.sellers'])
                ->whereHas('documentCreation', function ($query) {
                    $query->where('document_type', 'sale_contract');
                })
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            $formattedContracts = $contracts->getCollection()->map(function ($contract) {
                return [
                    'id' => $contract->id,
                    'contract_id' => $contract->contract_id,
                    'seller_name' => $contract->seller_name,
                    'land_plot_number' => $contract->land ? $contract->land->plot_number : 'N/A',
                    'total_amount' => $contract->total_amount,
                    'contract_date' => $contract->contract_date,
                    'status' => $contract->status,
                ];
            });

            return response()->json([
                'data' => $formattedContracts,
                'current_page' => $contracts->currentPage(),
                'last_page' => $contracts->lastPage(),
                'per_page' => $contracts->perPage(),
                'total' => $contracts->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching contracts: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Search for contracts by contract ID
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contract_id' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $contractId = $request->input('contract_id');
        $user = Auth::user();

        try {
            $result = $this->contractSearchService->searchByContractId($contractId, $user);
            
            if (!$result) {
                return response()->json(['error' => 'Contract not found'], 404);
            }
            
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while searching for the contract: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Export contract data to PDF or Excel
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $contractId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function export(Request $request, $contractId)
    {
        $validator = Validator::make($request->all(), [
            'format' => 'required|in:pdf,excel',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $format = $request->input('format');
        $user = Auth::user();

        try {
            $contract = SaleContract::where('contract_id', $contractId)->first();
            
            if (!$contract) {
                return response()->json(['error' => 'Contract not found'], 404);
            }
            
            return $this->documentExportService->exportContract($contract, $format, $user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while exporting the contract: ' . $e->getMessage()], 500);
        }
    }
}
