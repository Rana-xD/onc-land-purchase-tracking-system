<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FileUploadController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Upload a file to temporary storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadTemp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,pdf',
        ], [
            'file.required' => 'សូមជ្រើសរើសឯកសារ',
            'file.file' => 'ឯកសារមិនត្រឹមត្រូវ',
            'file.max' => 'ទំហំឯកសារមិនត្រូវលើសពី 10MB',
            'file.mimes' => 'ប្រភេទឯកសារត្រូវតែជា JPG, PNG, ឬ PDF',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $file = $request->file('file');
            $result = $this->fileUploadService->storeTemporary($file);
            
            return response()->json([
                'success' => true,
                'file' => [
                    'name' => $file->getClientOriginalName(),
                    'tempPath' => $result['path'],
                    'url' => '/storage/' . $result['path'],  // Add direct URL for easier access
                    'size' => $result['size'],
                    'type' => $result['mime_type'],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការបញ្ចូលឯកសារ: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a temporary file.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteTemp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $deleted = $this->fileUploadService->deleteFile($request->path);
            
            return response()->json([
                'success' => $deleted,
                'message' => $deleted ? 'ឯកសារត្រូវបានលុបដោយជោគជ័យ' : 'មិនអាចលុបឯកសារបានទេ'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការលុបឯកសារ: ' . $e->getMessage()
            ], 500);
        }
    }
}
