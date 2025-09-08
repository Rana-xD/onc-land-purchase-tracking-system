<?php

namespace Database\Seeders;

use App\Models\Buyer;
use App\Models\Document;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BuyerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only seed if no buyers exist
        if (Buyer::count() > 0) {
            $this->command->info('Buyers table already has data. Skipping seeding.');
            return;
        }

        // Khmer names for buyers (only 5)
        $khmerNames = [
            'សុខ វាសនា'
        ];

        // Create 5 buyers
        foreach ($khmerNames as $index => $name) {
            $sex = $index % 2 === 0 ? 'male' : 'female';
            $buyer = Buyer::create([
                'name' => $name,
                'sex' => $sex,
                'date_of_birth' => fake()->dateTimeBetween('-70 years', '-18 years')->format('Y-m-d'),
                'identity_number' => fake()->unique()->numerify('##########'),
                'address' => $this->getKhmerAddress(),
                'phone_number' => '0' . fake()->numberBetween(10, 99) . ' ' . fake()->numerify('### ###'),
            ]);

            // Create sample documents for each buyer
            $this->createSampleDocuments($buyer);
        }

        $this->command->info('Successfully seeded 5 buyers with documents.');
    }

    /**
     * Create sample documents for a buyer.
     *
     * @param Buyer $buyer
     * @return void
     */
    private function createSampleDocuments(Buyer $buyer): void
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

        // Randomly select 1-3 files
        $numFiles = rand(1, min(3, count($sampleFiles)));
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
            $targetDir = "buyers/{$buyer->id}";
            $targetPath = "{$targetDir}/{$filename}";
            
            // Create directory if it doesn't exist
            Storage::makeDirectory($targetDir);
            
            // Copy file to buyer's directory
            if (File::exists($sourcePath)) {
                $fileContents = File::get($sourcePath);
                Storage::put($targetPath, $fileContents);
                
                // Create document record
                Document::create([
                    'category' => 'buyer',
                    'reference_id' => $buyer->id,
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
        $pdf = $directory . '/sample-document.pdf';
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
        $jpg1 = $directory . '/sample-photo-1.jpg';
        $jpg2 = $directory . '/sample-photo-2.jpg';
        
        if (!File::exists($jpg1)) {
            // Create a very simple JPG
            $im = imagecreatetruecolor(100, 100);
            $text_color = imagecolorallocate($im, 233, 14, 91);
            imagestring($im, 1, 5, 5, 'Sample Photo 1', $text_color);
            imagejpeg($im, $jpg1);
            imagedestroy($im);
        }
        
        if (!File::exists($jpg2)) {
            // Create a very simple JPG
            $im = imagecreatetruecolor(100, 100);
            $text_color = imagecolorallocate($im, 14, 91, 233);
            imagestring($im, 1, 5, 5, 'Sample Photo 2', $text_color);
            imagejpeg($im, $jpg2);
            imagedestroy($im);
        }
    }

    /**
     * Get a random Khmer address.
     *
     * @return string
     */
    private function getKhmerAddress(): string
    {
        $provinces = [
            'ភ្នំពេញ', 'កណ្តាល', 'កំពង់ចាម', 'កំពង់ឆ្នាំង', 'កំពង់ស្ពឺ', 'កំពង់ធំ', 
            'កំពត', 'កោះកុង', 'ក្រចេះ', 'មណ្ឌលគិរី', 'ព្រះវិហារ', 'ព្រៃវែង', 'ពោធិ៍សាត់', 
            'រតនគិរី', 'សៀមរាប', 'ស្ទឹងត្រែង', 'ស្វាយរៀង', 'តាកែវ', 'ឧត្តរមានជ័យ', 'កែប', 'បាត់ដំបង'
        ];

        $districts = [
            'ដូនពេញ', 'ចំការមន', 'ទួលគោក', 'ដង្កោ', 'មានជ័យ', 'ឫស្សីកែវ', 'សែនសុខ', 
            'ពោធិ៍សែនជ័យ', 'ច្បារអំពៅ', 'ព្រែកព្នៅ', 'ជ្រោយចង្វារ', 'កំបូល'
        ];

        $communes = [
            'ផ្សារថ្មី', 'បឹងកេងកង', 'ទន្លេបាសាក់', 'បឹងត្របែក', 'ផ្សារដេប៉ូ', 'បឹងកក់', 
            'ស្រះចក', 'ទឹកល្អក់', 'បឹងទំពុន', 'ស្ទឹងមានជ័យ', 'ចាក់អង្រែ', 'បឹងសាឡាង'
        ];

        $province = $provinces[array_rand($provinces)];
        $district = $districts[array_rand($districts)];
        $commune = $communes[array_rand($communes)];
        $village = 'ភូមិ ' . fake()->randomNumber(1);
        $street = 'ផ្លូវ ' . fake()->randomNumber(3);
        $house = 'ផ្ទះលេខ ' . fake()->randomNumber(3);

        return "{$house}, {$street}, {$village}, {$commune}, {$district}, {$province}";
    }
}
