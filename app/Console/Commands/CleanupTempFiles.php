<?php

namespace App\Console\Commands;

use App\Services\FileUploadService;
use Illuminate\Console\Command;

class CleanupTempFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'files:cleanup-temp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up temporary files that are older than 24 hours';

    /**
     * Execute the console command.
     */
    public function handle(FileUploadService $fileUploadService)
    {
        $count = $fileUploadService->cleanupTempFiles();
        
        $this->info("Cleaned up {$count} temporary files.");
        
        return Command::SUCCESS;
    }
}
