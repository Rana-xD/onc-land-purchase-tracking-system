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

        // Generate plot numbers
        $plotNumbers = [];
        for ($i = 1; $i <= 50; $i++) {
            $plotNumbers[] = 'ក' . str_pad($i, 4, '0', STR_PAD_LEFT);
        }

        // Khmer locations
        $locations = [
            'ភូមិថ្មី សង្កាត់ដង្កោ ខណ្ឌដង្កោ រាជធានីភ្នំពេញ',
            'ភូមិព្រែកហូរ សង្កាត់ព្រែកព្នៅ ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ',
            'ភូមិត្រពាំងក្រសាំង សង្កាត់ច្បារអំពៅទី១ ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ',
            'ភូមិកំបូល សង្កាត់កំបូល ខណ្ឌកំបូល រាជធានីភ្នំពេញ',
            'ភូមិអូរបែកក្អម សង្កាត់និរោធ ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ',
            'ភូមិកោះពេជ្រ សង្កាត់កោះពេជ្រ ខណ្ឌច្បារអំពៅ រាជធានីភ្នំពេញ',
            'ភូមិសំរោងក្រោម សង្កាត់សំរោង ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
            'ភូមិត្រពាំងក្លែង សង្កាត់ចោមចៅ ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
            'ភូមិត្នោត សង្កាត់បឹងធំ ខណ្ឌកំបូល រាជធានីភ្នំពេញ',
            'ភូមិព្រៃវែង សង្កាត់ព្រៃវែង ខណ្ឌដង្កោ រាជធានីភ្នំពេញ',
            'ភូមិក្បាលថ្នល់ សង្កាត់បឹងទំពុន ខណ្ឌមានជ័យ រាជធានីភ្នំពេញ',
            'ភូមិបឹងសាឡាង សង្កាត់បឹងសាឡាង ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិបឹងកក់១ សង្កាត់បឹងកក់១ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិបឹងកក់២ សង្កាត់បឹងកក់២ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិទួលស្វាយព្រៃ១ សង្កាត់ទួលស្វាយព្រៃ១ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
            'ភូមិទួលស្វាយព្រៃ២ សង្កាត់ទួលស្វាយព្រៃ២ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
            'ភូមិទន្លេបាសាក់ សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
            'ភូមិបឹងកេងកង១ សង្កាត់បឹងកេងកង១ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
            'ភូមិបឹងកេងកង២ សង្កាត់បឹងកេងកង២ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
            'ភូមិបឹងកេងកង៣ សង្កាត់បឹងកេងកង៣ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
            'ភូមិអូឡាំពិក សង្កាត់អូឡាំពិក ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
            'ភូមិវាលវង់ សង្កាត់វាលវង់ ខណ្ឌ៧មករា រាជធានីភ្នំពេញ',
            'ភូមិមិត្តភាព សង្កាត់មិត្តភាព ខណ្ឌ៧មករា រាជធានីភ្នំពេញ',
            'ភូមិផ្សារដេប៉ូ១ សង្កាត់ផ្សារដេប៉ូ១ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិផ្សារដេប៉ូ២ សង្កាត់ផ្សារដេប៉ូ២ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិផ្សារដេប៉ូ៣ សង្កាត់ផ្សារដេប៉ូ៣ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិស្រះចក សង្កាត់ស្រះចក ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
            'ភូមិជ័យជំនះ សង្កាត់ជ័យជំនះ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
            'ភូមិផ្សារកណ្តាល សង្កាត់ផ្សារកណ្តាល ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
            'ភូមិផ្សារថ្មី សង្កាត់ផ្សារថ្មី១ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
            'ភូមិផ្សារចាស់ សង្កាត់ផ្សារចាស់ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
            'ភូមិចតុមុខ សង្កាត់ចតុមុខ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
            'ភូមិវត្តភ្នំ សង្កាត់វត្តភ្នំ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
            'ភូមិទឹកល្អក់១ សង្កាត់ទឹកល្អក់១ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិទឹកល្អក់២ សង្កាត់ទឹកល្អក់២ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិទឹកល្អក់៣ សង្កាត់ទឹកល្អក់៣ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
            'ភូមិបឹងកំពិស សង្កាត់បឹងកំពិស ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
            'ភូមិកាកាប សង្កាត់កាកាប ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
            'ភូមិស្ទឹងមានជ័យ សង្កាត់ស្ទឹងមានជ័យ ខណ្ឌមានជ័យ រាជធានីភ្នំពេញ',
            'ភូមិបុរីកីឡា សង្កាត់បុរីកីឡា ខណ្ឌ៧មករា រាជធានីភ្នំពេញ',
            'ភូមិទួលសង្កែ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ',
            'ភូមិឫស្សីកែវ សង្កាត់ឫស្សីកែវ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ',
            'ភូមិជ្រោយចង្វារ សង្កាត់ជ្រោយចង្វារ ខណ្ឌជ្រោយចង្វារ រាជធានីភ្នំពេញ',
            'ភូមិព្រែកលៀប សង្កាត់ព្រែកលៀប ខណ្ឌជ្រោយចង្វារ រាជធានីភ្នំពេញ',
            'ភូមិព្រែកតាសេក សង្កាត់ព្រែកតាសេក ខណ្ឌជ្រោយចង្វារ រាជធានីភ្នំពេញ',
            'ភូមិកោះដាច់ សង្កាត់កោះដាច់ ខណ្ឌជ្រោយចង្វារ រាជធានីភ្នំពេញ',
            'ភូមិបាក់ខែង សង្កាត់បាក់ខែង ខណ្ឌជ្រោយចង្វារ រាជធានីភ្នំពេញ',
            'ភូមិព្រែកព្នៅ សង្កាត់ព្រែកព្នៅ ខណ្ឌជ្រោយចង្វារ រាជធានីភ្នំពេញ',
            'ភូមិកំបូល សង្កាត់កំបូល ខណ្ឌកំបូល រាជធានីភ្នំពេញ',
            'ភូមិពញាពន់ សង្កាត់ពញាពន់ ខណ្ឌកំបូល រាជធានីភ្នំពេញ',
            'ភូមិព្រែកហូរ សង្កាត់ព្រែកហូរ ខណ្ឌកំបូល រាជធានីភ្នំពេញ',
            'ភូមិបឹងធំ សង្កាត់បឹងធំ ខណ្ឌកំបូល រាជធានីភ្នំពេញ',
            'ភូមិសំរោង សង្កាត់សំរោង ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
            'ភូមិចោមចៅ សង្កាត់ចោមចៅ ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
            'ភូមិត្រពាំងក្រសាំង សង្កាត់ត្រពាំងក្រសាំង ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
            'ភូមិស្នោរ សង្កាត់ស្នោរ ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ'
        ];

        // Create 50+ lands
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

        $this->command->info('Successfully seeded ' . $count . ' lands with documents.');
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
