<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Land;
use App\Models\Document;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class LandController extends Controller
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
        $query = Land::query();
        
        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('plot_number', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }
        
        // Sort functionality
        $sortField = $request->input('sort_field', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);
        
        // Pagination
        $perPage = $request->input('per_page', 10);
        $lands = $query->paginate($perPage);
        
        return response()->json($lands);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plot_number' => 'required|string|unique:lands,plot_number',
            'date_of_registration' => 'required|date|before_or_equal:today',
            'size' => 'required|numeric|min:0',
            'location' => 'required|string',
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

        // Create land
        $land = Land::create([
            'plot_number' => $request->plot_number,
            'date_of_registration' => $request->date_of_registration,
            'size' => $request->size,
            'location' => $request->location,
        ]);

        // Process documents if provided
        if ($request->has('documents') && is_array($request->documents)) {
            foreach ($request->documents as $doc) {
                // Move file from temporary storage to permanent storage
                $tempPath = $doc['path'];
                $fileName = $doc['name'];
                $permanentPath = "lands/{$land->id}/" . $fileName;
                
                if (Storage::exists($tempPath)) {
                    Storage::move($tempPath, $permanentPath);
                    
                    // Create document record
                    Document::create([
                        'category' => 'land',
                        'reference_id' => $land->id,
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
            'land' => $land->load('documents'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $land = Land::with('documents')->findOrFail($id);
        return response()->json($land);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $land = Land::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'plot_number' => [
                'required',
                'string',
                Rule::unique('lands')->ignore($land->id),
            ],
            'date_of_registration' => 'required|date|before_or_equal:today',
            'size' => 'required|numeric|min:0',
            'location' => 'required|string',
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

        // Update land
        $land->update([
            'plot_number' => $request->plot_number,
            'date_of_registration' => $request->date_of_registration,
            'size' => $request->size,
            'location' => $request->location,
        ]);

        // Process documents if provided
        if ($request->has('documents') && is_array($request->documents)) {
            // Check if at least one document is marked as display
            $hasDisplayDocument = collect($request->documents)->contains('is_display', true);
            
            if (!$hasDisplayDocument && !$land->documents()->where('is_display', true)->exists()) {
                return response()->json([
                    'errors' => ['documents' => ['At least one document must be marked as display']]
                ], 422);
            }
            
            foreach ($request->documents as $doc) {
                // Move file from temporary storage to permanent storage
                $tempPath = $doc['path'];
                $fileName = $doc['name'];
                $permanentPath = "lands/{$land->id}/" . $fileName;
                
                if (Storage::exists($tempPath)) {
                    Storage::move($tempPath, $permanentPath);
                    
                    // Create document record
                    Document::create([
                        'category' => 'land',
                        'reference_id' => $land->id,
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
            'land' => $land->load('documents'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $land = Land::findOrFail($id);
        
        // Delete associated documents and their files
        foreach ($land->documents as $document) {
            if (Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }
            $document->delete();
        }
        
        // Delete land
        $land->delete();
        
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
            'message' => 'ផ្ទុកឯកសារបានជោគជ័យ', // Successfully uploaded file
            'file' => $fileData,
        ]);
    }

    /**
     * Delete a document.
     */
    public function deleteDocument(string $landId, string $documentId)
    {
        $land = Land::findOrFail($landId);
        $document = Document::where('id', $documentId)
            ->where('category', 'land')
            ->where('reference_id', $landId)
            ->firstOrFail();
        
        // Check if this is the only display document
        if ($document->is_display && $land->documents()->where('is_display', true)->count() <= 1) {
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
            'message' => 'បានលុបឯកសារដោយជោគជ័យ', // Successfully deleted document
        ]);
    }

    /**
     * Set a document as display.
     */
    public function setDisplayDocument(string $landId, string $documentId)
    {
        $land = Land::findOrFail($landId);
        
        // Reset all documents to not display
        Document::where('category', 'land')
            ->where('reference_id', $landId)
            ->update(['is_display' => false]);
        
        // Set the selected document as display
        $document = Document::where('id', $documentId)
            ->where('category', 'land')
            ->where('reference_id', $landId)
            ->firstOrFail();
        
        $document->update(['is_display' => true]);
        
        return response()->json([
            'message' => 'បានកំណត់ឯកសារសម្រាប់បង្ហាញដោយជោគជ័យ', // Successfully set display document
        ]);
    }
}
