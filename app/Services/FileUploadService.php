<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Store a file in temporary storage.
     *
     * @param UploadedFile $file
     * @return array
     */
    public function storeTemporary(UploadedFile $file)
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        // Explicitly use the public disk so files are accessible via web
        $filePath = $file->storeAs('temp', $fileName, 'public');
        
        return [
            'name' => $fileName,
            'path' => $filePath,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ];
    }
    
    /**
     * Move a file from temporary storage to permanent storage.
     *
     * @param string $tempPath
     * @param string $category
     * @param int $referenceId
     * @param string $fileName
     * @return string|null
     */
    public function moveToPermStorage($tempPath, $category, $referenceId, $fileName)
    {
        $permanentPath = "{$category}s/{$referenceId}/" . $fileName;
        
        if (Storage::exists($tempPath)) {
            Storage::makeDirectory("{$category}s/{$referenceId}");
            Storage::move($tempPath, $permanentPath);
            return $permanentPath;
        }
        
        return null;
    }
    
    /**
     * Move a file from temporary storage to a specific directory.
     *
     * @param string $tempPath
     * @param string $targetDir
     * @return string|null
     */
    public function moveFromTemp($tempPath, $targetDir)
    {
        // Extract filename from path
        $fileName = basename($tempPath);
        $permanentPath = $targetDir . '/' . $fileName;
        
        if (Storage::exists($tempPath)) {
            Storage::makeDirectory($targetDir);
            Storage::move($tempPath, $permanentPath);
            return $permanentPath;
        }
        
        return null;
    }
    
    /**
     * Delete a file from storage.
     *
     * @param string $filePath
     * @return bool
     */
    public function deleteFile($filePath)
    {
        if (Storage::exists($filePath)) {
            return Storage::delete($filePath);
        }
        
        return false;
    }
    
    /**
     * Clean up temporary files older than 24 hours.
     *
     * @return int Number of files deleted
     */
    public function cleanupTempFiles()
    {
        $files = Storage::files('temp');
        $count = 0;
        $yesterday = now()->subDay()->timestamp;
        
        foreach ($files as $file) {
            // Extract timestamp from filename (time_originalname.ext)
            $fileName = basename($file);
            $parts = explode('_', $fileName, 2);
            
            if (count($parts) > 1 && is_numeric($parts[0])) {
                $fileTimestamp = (int) $parts[0];
                
                if ($fileTimestamp < $yesterday) {
                    Storage::delete($file);
                    $count++;
                }
            }
        }
        
        return $count;
    }
}
