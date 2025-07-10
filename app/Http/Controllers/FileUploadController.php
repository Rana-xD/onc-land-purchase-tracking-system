<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    /**
     * Upload a file to temporary storage
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadTemp(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|max:10240', // 10MB max
            ]);

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $fileName = $file->getClientOriginalName();
            $tempPath = 'temp/' . Str::uuid() . '.' . $extension;
            
            // Store the file in the temporary storage
            Storage::disk('public')->put($tempPath, file_get_contents($file));
            
            return response()->json([
                'success' => true,
                'file' => [
                    'tempPath' => $tempPath,
                    'fileName' => $fileName,
                    'type' => $file->getMimeType(),
                    'size' => $file->getSize()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error uploading file: ' . $e->getMessage()
            ], 500);
        }
    }
}
