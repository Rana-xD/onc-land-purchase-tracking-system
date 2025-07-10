<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buyer;
use App\Models\Document;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BuyerApiController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of buyers with pagination, search, and advanced filtering.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Buyer::query();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('identity_number', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }
        
        // Advanced filtering
        // Filter by sex
        if ($request->has('sex') && !empty($request->sex)) {
            $query->where('sex', $request->sex);
        }
        
        // Filter by date of birth range
        if ($request->has('date_of_birth_from') && !empty($request->date_of_birth_from)) {
            $query->whereDate('date_of_birth', '>=', $request->date_of_birth_from);
        }
        
        if ($request->has('date_of_birth_to') && !empty($request->date_of_birth_to)) {
            $query->whereDate('date_of_birth', '<=', $request->date_of_birth_to);
        }
        
        // Filter by identity type (if identity_type field exists)
        if ($request->has('identity_type') && !empty($request->identity_type)) {
            $query->where('identity_type', $request->identity_type);
        }
        
        // Filter by phone number
        if ($request->has('phone_number') && !empty($request->phone_number)) {
            $query->where('phone_number', 'like', "%{$request->phone_number}%");
        }
        
        // Filter by address
        if ($request->has('address') && !empty($request->address)) {
            $query->where('address', 'like', "%{$request->address}%");
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $buyers = $query->orderBy('created_at', 'desc')
                       ->paginate($perPage);

        return response()->json($buyers);
    }

    /**
     * Store a newly created buyer in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Debug logging
        $logPrefix = '[BuyerApiController:store] ';
        
        // Log the incoming request data (excluding base64 data to avoid log bloat)
        $requestData = $request->except(['documents']);
        $documentsCount = count($request->input('documents', []));
        Log::info($logPrefix . 'Received request with ' . $documentsCount . ' documents');
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sex' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
            'identity_number' => 'required|string|max:255',
            'address' => 'required|string',
            'phone_number' => 'required|string|max:20',
            'documents' => 'nullable|array',
            'documents.*.fileName' => 'required|string',
            'documents.*.base64' => 'required|string',
            'documents.*.mimeType' => 'nullable|string',
            'documents.*.isDisplay' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            Log::error($logPrefix . 'Validation failed: ' . json_encode($validator->errors()));
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // Create buyer
            $buyer = Buyer::create([
                'name' => $request->name,
                'sex' => $request->sex,
                'date_of_birth' => $request->date_of_birth,
                'identity_number' => $request->identity_number,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
            ]);
            
            Log::info($logPrefix . 'Buyer created with ID: ' . $buyer->id);

            // Process documents if any
            if ($request->has('documents') && is_array($request->documents) && count($request->documents) > 0) {
                Log::info($logPrefix . 'Processing ' . count($request->documents) . ' documents');
                
                // Log document metadata without base64 data
                $documentsMeta = collect($request->documents)->map(function($doc) {
                    return [
                        'fileName' => $doc['fileName'] ?? null,
                        'mimeType' => $doc['mimeType'] ?? null,
                        'isDisplay' => $doc['isDisplay'] ?? false,
                        'hasBase64' => isset($doc['base64']) && !empty($doc['base64']),
                    ];
                })->toArray();
                Log::info($logPrefix . 'Documents metadata: ' . json_encode($documentsMeta));
                
                $this->processDocuments($request->documents, $buyer);
            } else {
                Log::warning($logPrefix . 'No documents found in request');
            }

            DB::commit();

            return response()->json([
                'message' => 'Buyer created successfully',
                'buyer' => $buyer
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create buyer: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified buyer.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $buyer = Buyer::with('documents')->findOrFail($id);
        return response()->json($buyer);
    }

    /**
     * Update the specified buyer in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sex' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
            'identity_number' => 'required|string|max:255',
            'address' => 'required|string',
            'phone_number' => 'required|string|max:20',
            'documents' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $buyer = Buyer::findOrFail($id);
            $buyer->update([
                'name' => $request->name,
                'sex' => $request->sex,
                'date_of_birth' => $request->date_of_birth,
                'identity_number' => $request->identity_number,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
            ]);

            // Process documents if any
            if ($request->has('documents') && is_array($request->documents)) {
                $this->processDocuments($request->documents, $buyer);
            }

            DB::commit();

            return response()->json([
                'message' => 'Buyer updated successfully',
                'buyer' => $buyer
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update buyer: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified buyer from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $buyer = Buyer::findOrFail($id);
            
            // Delete associated documents first
            foreach ($buyer->documents as $document) {
                $this->fileUploadService->deleteFile($document->file_path);
                $document->delete();
            }
            
            $buyer->delete();

            DB::commit();

            return response()->json(['message' => 'Buyer deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete buyer: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Set a document as the display document for a buyer.
     *
     * @param  int  $id
     * @param  int  $documentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function setDisplayDocument($id, $documentId)
    {
        try {
            DB::beginTransaction();
            
            $buyer = Buyer::findOrFail($id);
            $document = Document::where('documentable_id', $id)
                ->where('documentable_type', get_class($buyer))
                ->findOrFail($documentId);
            
            // Reset all documents to not display
            Document::where('documentable_id', $id)
                ->where('documentable_type', get_class($buyer))
                ->update(['is_display' => false]);
            
            // Set the selected document as display
            $document->update(['is_display' => true]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Display document set successfully',
                'document' => $document
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to set display document: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Process documents for a buyer
     *
     * @param array $documents
     * @param Buyer $buyer
     * @return void
     */
    private function processDocuments(array $documents, Buyer $buyer)
    {
        $logPrefix = '[BuyerApiController:processDocuments] ';
        Log::info($logPrefix . 'Processing ' . count($documents) . ' documents for buyer ID: ' . $buyer->id);
        
        $fileUploadService = app(FileUploadService::class);
        $displaySet = false;
        $displayDocumentSet = false;

        foreach ($documents as $index => $document) {
            Log::info($logPrefix . 'Processing document ' . ($index + 1));
            
            // Reset is_display flag for all documents
            $isDisplay = false;

            // If this document is marked as display or no display document has been set yet
            if ((isset($document['isDisplay']) && $document['isDisplay']) || !$displaySet) {
                $isDisplay = true;
                $displaySet = true;
                Log::info($logPrefix . 'Setting document ' . ($index + 1) . ' as display document');
            }

            // Process base64 image data
            if (isset($document['base64']) && isset($document['fileName'])) {
                Log::info($logPrefix . 'Processing base64 image data for file: ' . $document['fileName']);
                
                try {
                    // Create target directory path
                    $targetDir = 'buyers/' . $buyer->id;
                    
                    // Use the FileUploadService to store the base64 file
                    $fileInfo = $fileUploadService->storeBase64File(
                        $document['base64'],
                        $targetDir,
                        $document['fileName']
                    );
                    
                    if ($fileInfo) {
                        Log::info($logPrefix . 'File saved successfully to: ' . $fileInfo['file_path']);
                        
                        // Get mime type
                        $mimeType = $document['mimeType'] ?? 'application/octet-stream';
                        
                        // Create document record
                        $newDocument = Document::create([
                            'documentable_id' => $buyer->id,
                            'documentable_type' => get_class($buyer),
                            'category' => 'buyer',  // Keep for backwards compatibility
                            'reference_id' => $buyer->id,  // Keep for backwards compatibility
                            'file_name' => $fileInfo['file_name'],
                            'file_path' => $fileInfo['file_path'],
                            'file_size' => $fileInfo['file_size'],
                            'mime_type' => $mimeType,
                            'is_display' => $isDisplay,
                        ]);
                        
                        Log::info($logPrefix . 'Document record created with ID: ' . $newDocument->id);
                        $displayDocumentSet = true;
                    } else {
                        Log::error($logPrefix . 'Failed to save file to storage');
                    }
                } catch (\Exception $e) {
                    Log::error($logPrefix . 'Exception while processing document: ' . $e->getMessage());
                    Log::error($logPrefix . 'Exception trace: ' . $e->getTraceAsString());
                }
            } else {
                Log::warning($logPrefix . 'Document missing base64 or fileName: ' . json_encode($document));
            }
        }
        
        // If no display document is set, set the first one as display
        if (!$displayDocumentSet) {
            $firstDocument = $buyer->documents()->first();
            if ($firstDocument) {
                $firstDocument->update(['is_display' => true]);
                Log::info($logPrefix . 'Set first document as display document');
            }
        }
    }
}
