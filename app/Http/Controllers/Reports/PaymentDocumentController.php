<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\ContractDocument;
use App\Models\PaymentDocument;
use App\Models\PaymentStep;
use App\Models\SaleContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PaymentDocumentController extends Controller
{
    /**
     * Decode a base64 encoded file
     *
     * @param string $base64File
     * @return string|false
     */
    private function decodeBase64File($base64File)
    {
        // Check if the string is a valid base64 encoded file
        if (!preg_match('/^data:([\w\/\-\.]+);base64,/', $base64File, $matches)) {
            return false;
        }
        
        // Extract the base64 encoded content (remove data:image/png;base64, part)
        $base64Content = substr($base64File, strpos($base64File, ',') + 1);
        
        // Decode the base64 string
        return base64_decode($base64Content);
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
            // Find the sale contract
            $saleContract = SaleContract::findOrFail($contractId);
            
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
                
                // Store the file
                $filePath = 'contract_documents/' . $uniqueFileName;
                Storage::put($filePath, $fileData);
                
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
                
                // Store the file
                $filePath = $file->storeAs('contract_documents', $uniqueFileName);
                
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
            
            // Create a new payment document record
            $document = new PaymentDocument([
                'payment_step_id' => $paymentStep->id,
                'document_type' => $documentType,
                'file_name' => $fileName,
                'file_path' => $path,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'uploaded_by' => $user->id,
                'uploaded_at' => now(),
            ]);
            
            $document->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'document' => $document,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while uploading the document: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download a payment document
     *
     * @param  int  $documentId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function download($documentId)
    {
        $document = PaymentDocument::findOrFail($documentId);
        
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json([
                'error' => 'Document file not found',
            ], 404);
        }
        
        return response()->download(
            Storage::disk('public')->path($document->file_path),
            $document->file_name
        );
    }

    /**
     * Delete a payment document
     *
     * @param  int  $documentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($documentId)
    {
        $document = PaymentDocument::findOrFail($documentId);
        $user = Auth::user();
        
        // Only allow the uploader or admin to delete the document
        if ($document->uploaded_by !== $user->id && !$user->is_admin) {
            return response()->json([
                'error' => 'You do not have permission to delete this document',
            ], 403);
        }
        
        try {
            // Delete the file from storage
            if (Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }
            
            // Delete the document record
            $document->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the document: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Upload a general document (not tied to a specific payment step)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadGeneral(Request $request)
    {
        // Check if we're receiving base64 encoded file or regular file upload
        if ($request->has('file') && is_string($request->input('file')) && strpos($request->input('file'), 'base64') !== false) {
            // Handle base64 encoded file
            $validator = Validator::make($request->all(), [
                'file' => 'required|string',
                'document_type' => 'required|in:land_certificate,other_document',
                'file_name' => 'required|string',
                'file_type' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $user = Auth::user();
            $base64File = $request->input('file');
            $documentType = $request->input('document_type');
            $fileName = $request->input('file_name');
            $fileType = $request->input('file_type');

            // Validate file type from the provided mime type
            $allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!in_array($fileType, $allowedTypes)) {
                return response()->json([
                    'error' => ['file' => ['The file must be a file of type: pdf, jpg, jpeg, png.']]
                ], 422);
            }
        } else {
            // Handle regular file upload (for backward compatibility)
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // Max 10MB
                'document_type' => 'required|in:land_certificate,other_document',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $user = Auth::user();
            $file = $request->file('file');
            $documentType = $request->input('document_type');
            $fileName = $file->getClientOriginalName();
        }

        try {
            // Generate a unique filename with timestamp
            $uniqueFileName = time() . '_' . $fileName;
            $path = '';
            $fileSize = 0;
            $mimeType = '';
            
            if (isset($base64File)) {
                // Handle base64 encoded file
                // Extract the base64 encoded content (remove data:image/png;base64, part)
                $base64Content = substr($base64File, strpos($base64File, ',') + 1);
                
                // Decode the base64 string
                $fileContent = base64_decode($base64Content);
                $fileSize = strlen($fileContent);
                $mimeType = $fileType;
                
                // Store the decoded file
                $path = 'general_documents/' . $uniqueFileName;
                Storage::disk('public')->put($path, $fileContent);
            } else {
                // Handle regular file upload
                $path = $file->storeAs(
                    'general_documents',
                    $uniqueFileName,
                    'public'
                );
                $fileSize = $file->getSize();
                $mimeType = $file->getMimeType();
            }
            
            // Create a new payment document record with no payment_step_id
            $document = new PaymentDocument([
                'payment_step_id' => null, // No specific payment step
                'document_type' => $documentType,
                'file_name' => $fileName,
                'file_path' => $path,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'uploaded_by' => $user->id,
                'uploaded_at' => now(),
            ]);
            
            $document->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'document' => $document,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while uploading the document: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Get all documents (both payment step specific and general)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllDocuments()
    {
        $documents = PaymentDocument::with('paymentStep')->get();
        
        return response()->json([
            'documents' => $documents,
        ]);
    }
}
