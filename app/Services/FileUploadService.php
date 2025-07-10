<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Store a file from base64 data to a specific directory.
     *
     * @param string $base64Data Base64 encoded file data
     * @param string $targetDir Directory to store the file in
     * @param string $fileName Name to give the file
     * @return array|null File information or null on failure
     */
    public function storeBase64File($base64Data, $targetDir, $fileName)
    {
        // Extract the base64 data - handle both with and without data URI prefix
        if (strpos($base64Data, ';base64,') !== false) {
            $base64Data = explode(';base64,', $base64Data)[1];
        }
        
        // Decode the base64 data
        $decodedData = base64_decode($base64Data);
        if ($decodedData === false) {
            return null;
        }
        
        // Generate a unique filename to avoid collisions
        $uniqueFileName = time() . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $fileName);
        $filePath = $targetDir . '/' . $uniqueFileName;
        
        // Create the directory if it doesn't exist
        Storage::disk('public')->makeDirectory($targetDir);
        
        // Save the file
        $saved = Storage::disk('public')->put($filePath, $decodedData);
        
        if (!$saved) {
            return null;
        }
        
        // Get file size
        $fileSize = Storage::disk('public')->size($filePath);
        
        return [
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_size' => $fileSize,
        ];
    }
    
    /**
     * Delete a file from storage and its parent directory if empty.
     *
     * @param string $filePath
     * @return bool
     */
    public function deleteFile($filePath)
    {
        $fileDeleted = false;
        
        if (Storage::disk('public')->exists($filePath)) {
            $fileDeleted = Storage::disk('public')->delete($filePath);
            
            // If file was deleted successfully, check if parent directory is empty
            if ($fileDeleted) {
                // Get the directory path (parent folder)
                $dirPath = dirname($filePath);
                
                // Check if directory exists and is empty
                if (Storage::disk('public')->exists($dirPath)) {
                    $filesInDir = Storage::disk('public')->files($dirPath);
                    $dirsInDir = Storage::disk('public')->directories($dirPath);
                    
                    // If directory is empty (no files and no subdirectories), delete it
                    if (empty($filesInDir) && empty($dirsInDir)) {
                        Storage::disk('public')->deleteDirectory($dirPath);
                    }
                }
            }
        }
        
        return $fileDeleted;
    }
}
