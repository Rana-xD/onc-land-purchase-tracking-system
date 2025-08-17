<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Seller;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SellerApiController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of sellers with pagination, search, and advanced filtering.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Check if user has permission to view sellers
        if (!Auth::user()->hasPermission('sellers.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Seller::query();

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
        $sellers = $query->orderBy('created_at', 'desc')
                       ->paginate($perPage);

        return response()->json($sellers);
    }

    /**
     * Store a newly created seller in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Check if user has permission to create sellers
        if (!Auth::user()->hasPermission('sellers.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

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

            // Create seller
            $seller = Seller::create([
                'name' => $request->name,
                'sex' => $request->sex,
                'date_of_birth' => $request->date_of_birth,
                'identity_number' => $request->identity_number,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
            ]);

            // Process documents if any
            if ($request->has('documents') && is_array($request->documents) && count($request->documents) > 0) {
                $this->processDocuments($request->documents, $seller);
            }

            DB::commit();

            return response()->json([
                'message' => 'Seller created successfully',
                'seller' => $seller
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create seller: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified seller.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Check if user has permission to view sellers
        if (!Auth::user()->hasPermission('sellers.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $seller = Seller::with('documents')->findOrFail($id);
        return response()->json($seller);
    }

    /**
     * Update the specified seller in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Check if user has permission to edit sellers
        if (!Auth::user()->hasPermission('sellers.edit')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

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

            $seller = Seller::findOrFail($id);
            $seller->update([
                'name' => $request->name,
                'sex' => $request->sex,
                'date_of_birth' => $request->date_of_birth,
                'identity_number' => $request->identity_number,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
            ]);

            // Process documents if any
            if ($request->has('documents') && is_array($request->documents)) {
                $this->processDocuments($request->documents, $seller);
            }

            DB::commit();

            return response()->json([
                'message' => 'Seller updated successfully',
                'seller' => $seller
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update seller: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified seller from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Check if user has permission to delete sellers
        if (!Auth::user()->hasPermission('sellers.delete')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            DB::beginTransaction();

            $seller = Seller::findOrFail($id);
            
            // Set who deleted this record
            $seller->deleted_by = Auth::id();
            $seller->save();
            
            // Soft delete the seller (documents remain intact for archive)
            $seller->delete();

            DB::commit();

            return response()->json(['message' => 'Seller archived successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to archive seller: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Set a document as the display document for a seller.
     *
     * @param  int  $id
     * @param  int  $documentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function setDisplayDocument($id, $documentId)
    {
        try {
            DB::beginTransaction();
            
            $seller = Seller::findOrFail($id);
            $document = Document::where('documentable_id', $id)
                ->where('documentable_type', get_class($seller))
                ->findOrFail($documentId);
            
            // Reset all documents to not display
            Document::where('documentable_id', $id)
                ->where('documentable_type', get_class($seller))
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
     * Process documents for a seller.
     *
     * @param  array  $documents
     * @param  \App\Models\Seller  $seller
     * @return void
     */
    private function processDocuments(array $documents, Seller $seller)
    {
        $displayDocumentSet = false;
        
        foreach ($documents as $document) {
            if (isset($document['id']) && isset($document['isExisting']) && $document['isExisting']) {
                // Update existing document
                $existingDoc = Document::find($document['id']);
                if ($existingDoc) {
                    $isDisplay = isset($document['isDisplay']) && $document['isDisplay'];
                    
                    if ($isDisplay) {
                        // Reset all other documents to not display
                        Document::where('documentable_id', $seller->id)
                            ->where('documentable_type', get_class($seller))
                            ->update(['is_display' => false]);
                            
                        $displayDocumentSet = true;
                    }
                    
                    $existingDoc->update([
                        'is_display' => $isDisplay,
                    ]);
                }
            } elseif (isset($document['base64']) && isset($document['fileName'])) {
                // Create new document from base64 data
                $isDisplay = isset($document['isDisplay']) && $document['isDisplay'];
                
                if ($isDisplay && !$displayDocumentSet) {
                    // Reset all other documents to not display
                    Document::where('documentable_id', $seller->id)
                        ->where('documentable_type', get_class($seller))
                        ->update(['is_display' => false]);
                        
                    $displayDocumentSet = true;
                }
                
                // Ensure the sellers directory exists
                $directory = 'sellers/' . $seller->id;
                if (!Storage::disk('public')->exists($directory)) {
                    Storage::disk('public')->makeDirectory($directory);
                }
                
                // Generate a unique filename
                $fileName = $document['fileName'];
                $extension = pathinfo($fileName, PATHINFO_EXTENSION);
                if (empty($extension)) {
                    $extension = 'jpg'; // Default extension if none provided
                }
                
                $uniqueFileName = uniqid() . '.' . $extension;
                $filePath = $directory . '/' . $uniqueFileName;
                
                // Decode and save the base64 image
                $base64Data = $document['base64'];
                $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
                $decodedData = base64_decode($base64Data);
                
                Storage::disk('public')->put($filePath, $decodedData);
                
                // Calculate file size
                $fileSize = strlen($decodedData);
                
                // Get mime type
                $mimeType = $document['mimeType'] ?? 'application/octet-stream';
                
                Document::create([
                    'documentable_id' => $seller->id,
                    'documentable_type' => get_class($seller),
                    'category' => 'seller',  // Keep for backwards compatibility
                    'reference_id' => $seller->id,  // Keep for backwards compatibility
                    'file_name' => $fileName,
                    'file_path' => $filePath,
                    'file_size' => $fileSize,
                    'mime_type' => $mimeType,
                    'is_display' => $isDisplay,
                ]);
            }
        }
        
        // If no display document is set, set the first one as display
        if (!$displayDocumentSet) {
            $firstDocument = $seller->documents()->first();
            if ($firstDocument) {
                $firstDocument->update(['is_display' => true]);
            }
        }
    }
}
