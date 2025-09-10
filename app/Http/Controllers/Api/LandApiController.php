<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Land;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LandApiController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of lands with pagination, search, and advanced filtering.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Check if user has permission to view lands
        if (!Auth::user()->hasPermission('lands.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Land::query();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('plot_number', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }
        
        // Advanced filtering
        // Filter by province
        if ($request->has('province') && !empty($request->province)) {
            $query->where('location', 'like', "%{$request->province}%");
        }
        
        // Filter by district
        if ($request->has('district') && !empty($request->district)) {
            $query->where('location', 'like', "%{$request->district}%");
        }
        
        // Filter by commune
        if ($request->has('commune') && !empty($request->commune)) {
            $query->where('location', 'like', "%{$request->commune}%");
        }
        
        // Filter by village
        if ($request->has('village') && !empty($request->village)) {
            $query->where('location', 'like', "%{$request->village}%");
        }
        
        // Filter by size range
        if ($request->has('size_from') && is_numeric($request->size_from)) {
            $query->where('size', '>=', $request->size_from);
        }
        
        if ($request->has('size_to') && is_numeric($request->size_to)) {
            $query->where('size', '<=', $request->size_to);
        }
        
        // Filter by price range (if price field exists)
        if ($request->has('price_from') && is_numeric($request->price_from)) {
            $query->where('price', '>=', $request->price_from);
        }
        
        if ($request->has('price_to') && is_numeric($request->price_to)) {
            $query->where('price', '<=', $request->price_to);
        }
        
        // Filter by registration date range
        if ($request->has('date_from') && !empty($request->date_from)) {
            $query->whereDate('date_of_registration', '>=', $request->date_from);
        }
        
        if ($request->has('date_to') && !empty($request->date_to)) {
            $query->whereDate('date_of_registration', '<=', $request->date_to);
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $lands = $query->orderBy('created_at', 'desc')
                       ->paginate($perPage);

        return response()->json($lands);
    }

    /**
     * Store a newly created land in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Check if user has permission to create lands
        if (!Auth::user()->hasPermission('lands.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'plot_number' => 'required|string|max:255',
            'size' => 'required|numeric|min:0',
            'location' => 'required|string',
            'date_of_registration' => 'required|date',
            'notes' => 'nullable|string',
            'documents' => 'nullable|array',
            'frontImage' => 'nullable|array',
            'frontImage.fileName' => 'nullable|string',
            'frontImage.base64' => 'nullable|string',
            'frontImage.mimeType' => 'nullable|string',
            'backImage' => 'nullable|array',
            'backImage.fileName' => 'nullable|string',
            'backImage.base64' => 'nullable|string',
            'backImage.mimeType' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // Create land first to get ID
            $land = Land::create([
                'plot_number' => $request->plot_number,
                'size' => $request->size,
                'location' => $request->location,
                'date_of_registration' => $request->date_of_registration,
                'notes' => $request->notes,
            ]);

            // Process images with land ID
            $frontImagePath = null;
            $backImagePath = null;
            
            if ($request->has('frontImage') && isset($request->frontImage['base64'])) {
                $frontImagePath = $this->processImageUpload($request->frontImage, 'lands', 'front', $land->id);
            }
            
            if ($request->has('backImage') && isset($request->backImage['base64'])) {
                $backImagePath = $this->processImageUpload($request->backImage, 'lands', 'back', $land->id);
            }

            // Update land with image paths
            if ($frontImagePath || $backImagePath) {
                $land->update([
                    'front_image_path' => $frontImagePath,
                    'back_image_path' => $backImagePath,
                ]);
            }

            // Process documents if any
            if ($request->has('documents') && is_array($request->documents) && count($request->documents) > 0) {
                $this->processDocuments($request->documents, $land);
            }

            DB::commit();

            return response()->json([
                'message' => 'Land created successfully',
                'land' => $land
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create land: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified land.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Check if user has permission to view lands
        if (!Auth::user()->hasPermission('lands.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $land = Land::with('documents')->findOrFail($id);
        return response()->json($land);
    }

    /**
     * Update the specified land in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Check if user has permission to edit lands
        if (!Auth::user()->hasPermission('lands.edit')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'plot_number' => 'required|string|max:255',
            'size' => 'required|numeric|min:0',
            'location' => 'required|string',
            'date_of_registration' => 'required|date',
            'notes' => 'nullable|string',
            'documents' => 'nullable|array',
            'frontImage' => 'nullable|array',
            'frontImage.fileName' => 'nullable|string',
            'frontImage.base64' => 'nullable|string',
            'frontImage.mimeType' => 'nullable|string',
            'backImage' => 'nullable|array',
            'backImage.fileName' => 'nullable|string',
            'backImage.base64' => 'nullable|string',
            'backImage.mimeType' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $land = Land::findOrFail($id);
            
            // Process front and back images
            $frontImagePath = $land->front_image_path;
            $backImagePath = $land->back_image_path;
            
            if ($request->has('frontImage') && isset($request->frontImage['base64'])) {
                // Delete old front image if exists
                if ($frontImagePath && Storage::disk('public')->exists($frontImagePath)) {
                    Storage::disk('public')->delete($frontImagePath);
                }
                $frontImagePath = $this->processImageUpload($request->frontImage, 'lands', 'front', $land->id);
            }
            
            if ($request->has('backImage') && isset($request->backImage['base64'])) {
                // Delete old back image if exists
                if ($backImagePath && Storage::disk('public')->exists($backImagePath)) {
                    Storage::disk('public')->delete($backImagePath);
                }
                $backImagePath = $this->processImageUpload($request->backImage, 'lands', 'back', $land->id);
            }
            
            $land->update([
                'plot_number' => $request->plot_number,
                'size' => $request->size,
                'location' => $request->location,
                'date_of_registration' => $request->date_of_registration,
                'notes' => $request->notes,
                'front_image_path' => $frontImagePath,
                'back_image_path' => $backImagePath,
            ]);

            // Process documents if any
            if ($request->has('documents') && is_array($request->documents)) {
                $this->processDocuments($request->documents, $land);
            }

            DB::commit();

            return response()->json([
                'message' => 'Land updated successfully',
                'land' => $land
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update land: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified land from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Check if user has permission to delete lands
        if (!Auth::user()->hasPermission('lands.delete')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            DB::beginTransaction();

            $land = Land::findOrFail($id);
            
            // Set who deleted this record
            $land->deleted_by = Auth::id();
            $land->save();
            
            // Soft delete the land (documents remain intact for archive)
            $land->delete();

            DB::commit();

            return response()->json(['message' => 'Land archived successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to archive land: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Set a document as the display document for a land.
     *
     * @param  int  $id
     * @param  int  $documentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function setDisplayDocument($id, $documentId)
    {
        try {
            DB::beginTransaction();
            
            $land = Land::findOrFail($id);
            $document = Document::where('documentable_id', $id)
                ->where('documentable_type', get_class($land))
                ->findOrFail($documentId);
            
            // Reset all documents to not display
            Document::where('documentable_id', $id)
                ->where('documentable_type', get_class($land))
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
     * Process documents for a land.
     *
     * @param  array  $documents
     * @param  \App\Models\Land  $land
     * @return void
     */
    private function processDocuments(array $documents, Land $land)
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
                        Document::where('documentable_id', $land->id)
                            ->where('documentable_type', get_class($land))
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
                    Document::where('documentable_id', $land->id)
                        ->where('documentable_type', get_class($land))
                        ->update(['is_display' => false]);
                        
                    $displayDocumentSet = true;
                }
                
                // Ensure the lands directory exists
                $directory = 'lands/' . $land->id;
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
                    'documentable_id' => $land->id,
                    'documentable_type' => get_class($land),
                    'category' => 'land',  // Keep for backwards compatibility
                    'reference_id' => $land->id,  // Keep for backwards compatibility
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
            $firstDocument = $land->documents()->first();
            if ($firstDocument) {
                $firstDocument->update(['is_display' => true]);
            }
        }
    }

    /**
     * Process image upload from base64 data
     *
     * @param array $imageData
     * @param string $category
     * @param string $type
     * @param int $recordId
     * @return string|null
     */
    private function processImageUpload($imageData, $category, $type, $recordId)
    {
        try {
            if (!isset($imageData['base64']) || !isset($imageData['fileName'])) {
                return null;
            }

            // Extract base64 data (remove data:image/jpeg;base64, prefix if present)
            $base64Data = $imageData['base64'];
            if (strpos($base64Data, ',') !== false) {
                $base64Data = explode(',', $base64Data)[1];
            }

            // Decode base64
            $fileData = base64_decode($base64Data);
            if ($fileData === false) {
                return null;
            }

            // Generate unique filename
            $extension = pathinfo($imageData['fileName'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $extension;
            
            // Create directory path using ID-based structure: lands/1/front/ or lands/1/back/
            $directory = $category . '/' . $recordId . '/' . $type;
            $filePath = $directory . '/' . $filename;

            // Ensure directory exists
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory, 0755, true);
            }

            // Store the file using public disk
            if (Storage::disk('public')->put($filePath, $fileData)) {
                // Return the path relative to storage/app/public for database storage
                return $filePath;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Error processing image upload: ' . $e->getMessage());
            return null;
        }
    }
}
