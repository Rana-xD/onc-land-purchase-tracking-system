<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\ContractDocument;
use App\Models\SaleContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ContractDocumentController extends Controller
{
    /**
     * Get all contract documents
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Get all contract documents with their related sale contracts
            $documents = ContractDocument::with('saleContract')
                ->orderBy('uploaded_at', 'desc')
                ->get()
                ->map(function ($document) {
                    return [
                        'id' => $document->id,
                        'file_name' => $document->file_name,
                        'file_path' => $document->file_path,
                        'file_size' => $document->file_size,
                        'mime_type' => $document->mime_type,
                        'uploaded_at' => $document->uploaded_at,
                        'contract_id' => $document->saleContract ? $document->saleContract->contract_id : null,
                        'contract_info' => $document->saleContract ? [
                            'contract_id' => $document->saleContract->contract_id,
                            'buyer_name' => $document->saleContract->buyer_info['name'] ?? null,
                            'seller_name' => $document->saleContract->seller_info['name'] ?? null,
                        ] : null
                    ];
                });
            
            return response()->json([
                'success' => true,
                'documents' => $documents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'មានបញ្ហាក្នុងការទាញឯកសារ: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Upload a contract document for a sale contract
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $contractId
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request, $contractId)
    {
        try {
            // Find the sale contract by contract_id
            $saleContract = SaleContract::where('contract_id', $contractId)->firstOrFail();
            
            // Check if the request contains a base64 encoded file
            if ($request->has('file') && is_string($request->file) && Str::startsWith($request->file, 'data:')) {
                // Handle base64 encoded file
                $validator = Validator::make($request->all(), [
                    'file' => 'required|string',
                    'file_name' => 'required|string|max:255',
                    'file_type' => 'required|string|max:100',
                    'file_size' => 'required|integer|max:10485760', // 10MB max
                ]);
                
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 422);
                }
                
                // Extract file information
                $base64File = $request->file;
                $fileName = $request->file_name;
                $fileType = $request->file_type;
                $fileSize = $request->file_size;
                
                // Decode base64 file
                $fileData = $this->decodeBase64File($base64File);
                if (!$fileData) {
                    return response()->json(['error' => 'Invalid base64 file'], 422);
                }
                
                // Generate a unique filename
                $uniqueFileName = time() . '_' . $fileName;
                
                // Store the file in public disk for web accessibility, organized by contract_id
                $folderPath = 'contract_documents/' . $saleContract->contract_id;
                $filePath = $folderPath . '/' . $uniqueFileName;
                Storage::disk('public')->put($filePath, $fileData);
                
                // Create document record
                $document = new ContractDocument();
                $document->sale_contract_id = $saleContract->id;
                $document->file_name = $fileName;
                $document->file_path = $filePath;
                $document->file_size = $fileSize;
                $document->mime_type = $fileType;
                $document->uploaded_by = Auth::id();
                $document->uploaded_at = now();
                $document->save();
                
                return response()->json(['success' => true, 'document' => $document]);
            } else {
                // Handle regular file upload
                $validator = Validator::make($request->all(), [
                    'file' => 'required|file|mimes:pdf,png,jpg,jpeg|max:10240', // 10MB max
                ]);
                
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 422);
                }
                
                $file = $request->file('file');
                
                // Generate a unique filename
                $uniqueFileName = time() . '_' . $file->getClientOriginalName();
                
                // Store the file in public disk for web accessibility, organized by contract_id
                $folderPath = 'contract_documents/' . $saleContract->contract_id;
                $filePath = $file->storeAs($folderPath, $uniqueFileName, 'public');
                
                // Create document record
                $document = new ContractDocument();
                $document->sale_contract_id = $saleContract->id;
                $document->file_name = $file->getClientOriginalName();
                $document->file_path = $filePath;
                $document->file_size = $file->getSize();
                $document->mime_type = $file->getMimeType();
                $document->uploaded_by = Auth::id();
                $document->uploaded_at = now();
                $document->save();
                
                return response()->json(['success' => true, 'document' => $document]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while uploading the document: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Decode a base64 encoded file
     *
     * @param  string  $base64File
     * @return string|false
     */
    private function decodeBase64File($base64File)
    {
        // Check if the string is a valid base64 encoded file
        if (preg_match('/^data:([a-z0-9]+\/[a-z0-9]+);base64,/', $base64File, $matches)) {
            // Extract the base64 encoded content
            $base64Content = substr($base64File, strpos($base64File, ',') + 1);
            
            // Decode the base64 string
            $fileContent = base64_decode($base64Content);
            
            if ($fileContent === false) {
                return false;
            }
            
            return $fileContent;
        }
        
        return false;
    }

    /**
     * Download a contract document
     *
     * @param  int  $documentId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function download($documentId)
    {
        try {
            // Find the document
            $document = ContractDocument::findOrFail($documentId);
            
            // Check if file exists
            if (!Storage::disk('public')->exists($document->file_path)) {
                return response()->json(['error' => 'ឯកសារមិនមាននៅក្នុងប្រព័ន្ធទេ'], 404);
            }
            
            // Return the file for download
            return response()->download(Storage::disk('public')->path($document->file_path), $document->file_name);
        } catch (\Exception $e) {
            return response()->json(['error' => 'មានបញ្ហាក្នុងការទាញយកឯកសារ: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a contract document
     *
     * @param  int  $documentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($documentId)
    {
        try {
            // Find the document
            $document = ContractDocument::findOrFail($documentId);
            
            // Get the contract_id from the document
            $saleContract = $document->saleContract;
            $contractId = $saleContract ? $saleContract->contract_id : null;
            
            // Get the folder path from the file path
            $filePath = $document->file_path;
            $folderPath = dirname($filePath);
            
            // Delete the file from storage if it exists
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            
            // Delete the document record
            $document->delete();
            
            // Check if this was the last file in the folder and remove the folder if empty
            if ($contractId && $folderPath) {
                // Get all files in the folder
                $filesInFolder = Storage::disk('public')->files($folderPath);
                
                // If no more files in the folder, delete the folder
                if (empty($filesInFolder)) {
                    Storage::disk('public')->deleteDirectory($folderPath);
                }
            }
            
            return response()->json(['success' => true, 'message' => 'ឯកសារត្រូវបានលុបដោយជោគជ័យ']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'មានបញ្ហាក្នុងការលុបឯកសារ: ' . $e->getMessage()], 500);
        }
    }
}
