<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\Document;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SellerController extends Controller
{
    /**
     * The file upload service instance.
     *
     * @var FileUploadService
     */
    protected $fileUploadService;
    
    /**
     * Create a new controller instance.
     *
     * @param  FileUploadService  $fileUploadService
     * @return void
     */
    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Seller::query();
        
        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('identity_number', 'like', "%{$search}%");
            });
        }
        
        // Sort functionality
        $sortField = $request->input('sort_field', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);
        
        // Pagination
        $perPage = $request->input('per_page', 10);
        $sellers = $query->paginate($perPage);
        
        return response()->json($sellers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sex' => 'required|in:male,female',
            'date_of_birth' => 'required|date|before:today',
            'identity_number' => 'required|string|unique:sellers,identity_number',
            'address' => 'required|string',
            'phone_number' => 'required|string',
            'documents' => 'sometimes|array|min:1|max:4',
            'documents.*.path' => 'required|string',
            'documents.*.name' => 'required|string',
            'documents.*.size' => 'required|integer',
            'documents.*.mime_type' => 'required|string',
            'documents.*.is_display' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if at least one document is marked as display
        if ($request->has('documents')) {
            $hasDisplayDocument = collect($request->documents)->contains('is_display', true);
            if (!$hasDisplayDocument) {
                return response()->json([
                    'errors' => ['documents' => ['At least one document must be marked as display']]
                ], 422);
            }
        }

        // Create seller
        $seller = Seller::create([
            'name' => $request->name,
            'sex' => $request->sex,
            'date_of_birth' => $request->date_of_birth,
            'identity_number' => $request->identity_number,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
        ]);

        // Process documents if provided
        if ($request->has('documents') && is_array($request->documents)) {
            foreach ($request->documents as $doc) {
                // Move file from temporary storage to permanent storage
                $tempPath = $doc['path'];
                $fileName = $doc['name'];
                $permanentPath = "sellers/{$seller->id}/" . $fileName;
                
                if (Storage::exists($tempPath)) {
                    Storage::move($tempPath, $permanentPath);
                    
                    // Create document record
                    Document::create([
                        'category' => 'seller',
                        'reference_id' => $seller->id,
                        'file_name' => $fileName,
                        'file_path' => $permanentPath,
                        'file_size' => $doc['size'],
                        'mime_type' => $doc['mime_type'],
                        'is_display' => $doc['is_display'] ?? false,
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'បានបន្ថែមទិន្នន័យដោយជោគជ័យ', // Successfully added data
            'seller' => $seller->load('documents'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $seller = Seller::with('documents')->findOrFail($id);
        return response()->json($seller);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $seller = Seller::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sex' => 'required|in:male,female',
            'date_of_birth' => 'required|date|before:today',
            'identity_number' => [
                'required',
                'string',
                Rule::unique('sellers')->ignore($seller->id),
            ],
            'address' => 'required|string',
            'phone_number' => 'required|string',
            'documents' => 'sometimes|array|max:4',
            'documents.*.path' => 'required|string',
            'documents.*.name' => 'required|string',
            'documents.*.size' => 'required|integer',
            'documents.*.mime_type' => 'required|string',
            'documents.*.is_display' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update seller
        $seller->update([
            'name' => $request->name,
            'sex' => $request->sex,
            'date_of_birth' => $request->date_of_birth,
            'identity_number' => $request->identity_number,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
        ]);

        // Process documents if provided
        if ($request->has('documents') && is_array($request->documents)) {
            // Check if at least one document is marked as display
            $hasDisplayDocument = collect($request->documents)->contains('is_display', true);
            
            if (!$hasDisplayDocument && !$seller->documents()->where('is_display', true)->exists()) {
                return response()->json([
                    'errors' => ['documents' => ['At least one document must be marked as display']]
                ], 422);
            }
            
            foreach ($request->documents as $doc) {
                // Move file from temporary storage to permanent storage
                $tempPath = $doc['path'];
                $fileName = $doc['name'];
                $permanentPath = "sellers/{$seller->id}/" . $fileName;
                
                if (Storage::exists($tempPath)) {
                    Storage::move($tempPath, $permanentPath);
                    
                    // Create document record
                    Document::create([
                        'category' => 'seller',
                        'reference_id' => $seller->id,
                        'file_name' => $fileName,
                        'file_path' => $permanentPath,
                        'file_size' => $doc['size'],
                        'mime_type' => $doc['mime_type'],
                        'is_display' => $doc['is_display'] ?? false,
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'បានកែប្រែទិន្នន័យដោយជោគជ័យ', // Successfully updated data
            'seller' => $seller->load('documents'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $seller = Seller::findOrFail($id);
        
        // Delete associated documents and their files
        foreach ($seller->documents as $document) {
            if (Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }
            $document->delete();
        }
        
        // Delete seller
        $seller->delete();
        
        return response()->json([
            'message' => 'បានលុបទិន្នន័យដោយជោគជ័យ', // Successfully deleted data
        ]);
    }

    /**
     * Upload temporary files.
     */
    public function uploadTemp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,pdf', // 10MB max, only JPG, PNG, PDF
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $fileData = $this->fileUploadService->storeTemporary($file);
        
        return response()->json([
            'message' => 'ផ្ទុកកិច្ចសន្យាបានជោគជ័យ', // Successfully uploaded file
            'file' => $fileData,
        ]);
    }

    /**
     * Delete a document.
     */
    public function deleteDocument(string $sellerId, string $documentId)
    {
        $seller = Seller::findOrFail($sellerId);
        $document = Document::where('id', $documentId)
            ->where('category', 'seller')
            ->where('reference_id', $sellerId)
            ->firstOrFail();
        
        // Check if this is the only display document
        if ($document->is_display && $seller->documents()->where('is_display', true)->count() <= 1) {
            return response()->json([
                'errors' => ['document' => ['Cannot delete the only display document']]
            ], 422);
        }
        
        // Delete file
        if (Storage::exists($document->file_path)) {
            Storage::delete($document->file_path);
        }
        
        // Delete document record
        $document->delete();
        
        return response()->json([
            'message' => 'បានលុបកិច្ចសន្យាដោយជោគជ័យ', // Successfully deleted document
        ]);
    }

    /**
     * Set a document as display.
     */
    public function setDisplayDocument(string $sellerId, string $documentId)
    {
        $seller = Seller::findOrFail($sellerId);
        
        // Reset all documents to not display
        Document::where('category', 'seller')
            ->where('reference_id', $sellerId)
            ->update(['is_display' => false]);
        
        // Set the selected document as display
        $document = Document::where('id', $documentId)
            ->where('category', 'seller')
            ->where('reference_id', $sellerId)
            ->firstOrFail();
        
        $document->update(['is_display' => true]);
        
        return response()->json([
            'message' => 'បានកំណត់កិច្ចសន្យាសម្រាប់បង្ហាញដោយជោគជ័យ', // Successfully set display document
        ]);
    }
}
