<?php

namespace Database\Seeders;

use App\Models\Land;
use App\Models\Document;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class LandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only seed if no lands exist
        if (Land::count() > 0) {
            $this->command->info('Lands table already has data. Skipping seeding.');
            return;
        }

        // Generate plot numbers (only 5)
        $plotNumbers = [];
        for ($i = 1; $i <= 1; $i++) {
            $plotNumbers[] = 'ក' . str_pad($i, 4, '0', STR_PAD_LEFT);
        }

        // Khmer locations (only 5)
        $locations = [
            'ភូមិថ្មី សង្កាត់ដង្កោ ខណ្ឌដង្កោ រាជធានីភ្នំពេញ',
            'ភូមិព្រែកហូរ សង្កាត់ព្រែកព្នៅ ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ',
            'ភូមិត្រពាំងក្រសាំង សង្កាត់ច្បារអំពៅទី១ ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ',
            'ភូមិកំបូល សង្កាត់កំបូល ខណ្ឌកំបូល រាជធានីភ្នំពេញ',
            'ភូមិអូរបែកក្អម សង្កាត់និរោធ ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ'
        ];

        // Create 5 lands
        $count = 0;
        foreach ($plotNumbers as $plotNumber) {
            // Get a random location or cycle through them
            $location = $locations[$count % count($locations)];
            
            // Generate a random size between 100 and 10000 square meters
            $size = fake()->randomFloat(2, 100, 10000);
            
            // Generate a registration date within the last 10 years
            $registrationDate = fake()->dateTimeBetween('-10 years', 'now')->format('Y-m-d');
            
            $land = Land::create([
                'plot_number' => $plotNumber,
                'date_of_registration' => $registrationDate,
                'size' => $size,
                'location' => $location,
            ]);

            // Create sample documents for each land
            $this->createSampleDocuments($land);
            
            $count++;
        }

        $this->command->info('Successfully seeded 5 lands with documents.');
    }

    /**
     * Create sample documents for a land.
     *
     * @param Land $land
     * @return void
     */
    private function createSampleDocuments(Land $land): void
    {
        // Ensure the sample documents directory exists
        $sampleDir = storage_path('app/samples');
        if (!File::exists($sampleDir)) {
            File::makeDirectory($sampleDir, 0755, true);
            
            // Create sample files if they don't exist
            $this->createSampleFiles($sampleDir);
        }

        // Get sample files
        $sampleFiles = File::files($sampleDir);
        
        // Skip if no sample files
        if (empty($sampleFiles)) {
            return;
        }

        // Randomly select 1-4 files
        $numFiles = rand(1, min(4, count($sampleFiles)));
        $selectedFiles = array_rand(array_flip(array_map(function($file) {
            return $file->getFilename();
        }, $sampleFiles)), $numFiles);
        
        if (!is_array($selectedFiles)) {
            $selectedFiles = [$selectedFiles];
        }
        
        // Create document records and copy files
        $isFirstFile = true;
        foreach ($selectedFiles as $filename) {
            $sourcePath = $sampleDir . '/' . $filename;
            $targetDir = "lands/{$land->id}";
            $targetPath = "{$targetDir}/{$filename}";
            
            // Create directory if it doesn't exist
            Storage::makeDirectory($targetDir);
            
            // Copy file to land's directory
            if (File::exists($sourcePath)) {
                $fileContents = File::get($sourcePath);
                Storage::put($targetPath, $fileContents);
                
                // Create document record
                Document::create([
                    'category' => 'land',
                    'reference_id' => $land->id,
                    'file_name' => $filename,
                    'file_path' => $targetPath,
                    'file_size' => File::size($sourcePath),
                    'mime_type' => File::mimeType($sourcePath),
                    'is_display' => $isFirstFile, // First file is display
                ]);
                
                $isFirstFile = false;
            }
        }
    }

    /**
     * Create sample files for seeding.
     *
     * @param string $directory
     * @return void
     */
    private function createSampleFiles(string $directory): void
    {
        // Create a sample PDF
        $pdf = $directory . '/sample-land-document.pdf';
        if (!File::exists($pdf)) {
            $pdfContent = '%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000102 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
178
%%EOF';
            File::put($pdf, $pdfContent);
        }

        // Create sample JPG files
        $jpg1 = $directory . '/sample-land-photo-1.jpg';
        $jpg2 = $directory . '/sample-land-photo-2.jpg';
        $jpg3 = $directory . '/sample-land-map.jpg';
        
        if (!File::exists($jpg1)) {
            // Create a very simple JPG
            $im = imagecreatetruecolor(100, 100);
            $text_color = imagecolorallocate($im, 233, 14, 91);
            imagestring($im, 1, 5, 5, 'Land Photo 1', $text_color);
            imagejpeg($im, $jpg1);
            imagedestroy($im);
        }
        
        if (!File::exists($jpg2)) {
            // Create a very simple JPG
            $im = imagecreatetruecolor(100, 100);
            $text_color = imagecolorallocate($im, 14, 91, 233);
            imagestring($im, 1, 5, 5, 'Land Photo 2', $text_color);
            imagejpeg($im, $jpg2);
            imagedestroy($im);
        }
        
        if (!File::exists($jpg3)) {
            // Create a very simple JPG
            $im = imagecreatetruecolor(100, 100);
            $text_color = imagecolorallocate($im, 91, 233, 14);
            imagestring($im, 1, 5, 5, 'Land Map', $text_color);
            imagejpeg($im, $jpg3);
            imagedestroy($im);
        }
    }
}
