<?php

namespace Tests\Feature;

use App\Models\Buyer;
use App\Models\Document;
use App\Models\Land;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DataEntryTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'role' => 'administrator',
            'is_active' => true,
        ]);
        
        // Mock storage
        Storage::fake('public');
    }

    /** @test */
    public function user_can_access_data_entry_category_selection()
    {
        $response = $this->actingAs($this->user)
            ->get(route('data-entry.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('DataEntry/CategorySelection'));
    }

    /** @test */
    public function user_can_access_buyers_index()
    {
        $response = $this->actingAs($this->user)
            ->get(route('data-entry.buyers.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('DataEntry/Buyers/Index'));
    }

    /** @test */
    public function user_can_access_sellers_index()
    {
        $response = $this->actingAs($this->user)
            ->get(route('data-entry.sellers.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('DataEntry/Sellers/Index'));
    }

    /** @test */
    public function user_can_access_lands_index()
    {
        $response = $this->actingAs($this->user)
            ->get(route('data-entry.lands.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('DataEntry/Lands/Index'));
    }

    /** @test */
    public function user_can_upload_temporary_file()
    {
        $file = UploadedFile::fake()->image('document.jpg');
        
        $response = $this->actingAs($this->user)
            ->postJson('/api/files/upload-temp', [
                'file' => $file,
            ]);
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'file' => [
                'name',
                'tempPath',
                'size',
                'type',
            ],
        ]);
        
        $this->assertTrue($response->json('success'));
    }

    /** @test */
    public function user_can_create_buyer_with_documents()
    {
        // Upload a temporary file first
        $file = UploadedFile::fake()->image('buyer_doc.jpg');
        
        $tempUploadResponse = $this->actingAs($this->user)
            ->postJson('/api/files/upload-temp', [
                'file' => $file,
            ]);
        
        $tempPath = $tempUploadResponse->json('file.tempPath');
        
        // Create buyer with the temp document
        $response = $this->actingAs($this->user)
            ->postJson('/api/buyers', [
                'name' => 'ឈិន សុខា',
                'sex' => 'male',
                'date_of_birth' => '1985-05-15',
                'identity_number' => '123456789',
                'address' => 'ភូមិថ្មី សង្កាត់បឹងកេងកង ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
                'phone_number' => '012345678',
                'documents' => [
                    [
                        'tempPath' => $tempPath,
                        'fileName' => 'buyer_doc.jpg',
                        'isDisplay' => true
                    ]
                ]
            ]);
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseHas('buyers', [
            'name' => 'ឈិន សុខា',
            'sex' => 'male',
        ]);
        
        $buyer = Buyer::where('name', 'ឈិន សុខា')->first();
        $this->assertNotNull($buyer);
        
        $this->assertDatabaseHas('documents', [
            'documentable_id' => $buyer->id,
            'documentable_type' => Buyer::class,
            'is_display' => 1,
        ]);
    }

    /** @test */
    public function user_can_create_seller_with_documents()
    {
        // Upload a temporary file first
        $file = UploadedFile::fake()->image('seller_doc.jpg');
        
        $tempUploadResponse = $this->actingAs($this->user)
            ->postJson('/api/files/upload-temp', [
                'file' => $file,
            ]);
        
        $tempPath = $tempUploadResponse->json('file.tempPath');
        
        // Create seller with the temp document
        $response = $this->actingAs($this->user)
            ->postJson('/api/sellers', [
                'name' => 'ស៊ុន សុភា',
                'sex' => 'female',
                'date_of_birth' => '1990-03-20',
                'identity_number' => '987654321',
                'address' => 'ភូមិទួលសង្កែ សង្កាត់បឹងកក់ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
                'phone_number' => '098765432',
                'documents' => [
                    [
                        'tempPath' => $tempPath,
                        'fileName' => 'seller_doc.jpg',
                        'isDisplay' => true
                    ]
                ]
            ]);
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseHas('sellers', [
            'name' => 'ស៊ុន សុភា',
            'sex' => 'female',
        ]);
        
        $seller = Seller::where('name', 'ស៊ុន សុភា')->first();
        $this->assertNotNull($seller);
        
        $this->assertDatabaseHas('documents', [
            'documentable_id' => $seller->id,
            'documentable_type' => Seller::class,
            'is_display' => 1,
        ]);
    }

    /** @test */
    public function user_can_create_land_with_documents()
    {
        // Upload a temporary file first
        $file = UploadedFile::fake()->image('land_doc.jpg');
        
        $tempUploadResponse = $this->actingAs($this->user)
            ->postJson('/api/files/upload-temp', [
                'file' => $file,
            ]);
        
        $tempPath = $tempUploadResponse->json('file.tempPath');
        
        // Create land with the temp document
        $response = $this->actingAs($this->user)
            ->postJson('/api/lands', [
                'title_deed_number' => '12345',
                'location' => 'ជិតផ្សារថ្មី',
                'province' => 'កណ្តាល',
                'district' => 'តាខ្មៅ',
                'commune' => 'តាខ្មៅ',
                'village' => 'ត្រពាំងក្រសាំង',
                'size' => 1000,
                'size_unit' => 'sqm',
                'price_per_unit' => 100,
                'total_price' => 100000,
                'documents' => [
                    [
                        'tempPath' => $tempPath,
                        'fileName' => 'land_doc.jpg',
                        'isDisplay' => true
                    ]
                ]
            ]);
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseHas('lands', [
            'title_deed_number' => '12345',
            'location' => 'ជិតផ្សារថ្មី',
        ]);
        
        $land = Land::where('title_deed_number', '12345')->first();
        $this->assertNotNull($land);
        
        $this->assertDatabaseHas('documents', [
            'documentable_id' => $land->id,
            'documentable_type' => Land::class,
            'is_display' => 1,
        ]);
    }

    /** @test */
    public function user_can_update_buyer()
    {
        // Create a buyer first
        $buyer = Buyer::factory()->create();
        $document = Document::factory()->create([
            'documentable_id' => $buyer->id,
            'documentable_type' => Buyer::class,
            'is_display' => true,
        ]);
        
        // Update the buyer
        $response = $this->actingAs($this->user)
            ->putJson("/api/buyers/{$buyer->id}", [
                'name' => 'ឈិន សុខា (កែប្រែ)',
                'sex' => $buyer->sex,
                'date_of_birth' => $buyer->date_of_birth,
                'identity_number' => $buyer->identity_number,
                'address' => $buyer->address,
                'phone_number' => $buyer->phone_number,
                'documents' => [
                    [
                        'id' => $document->id,
                        'isExisting' => true,
                        'fileName' => $document->file_name,
                        'isDisplay' => true
                    ]
                ]
            ]);
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseHas('buyers', [
            'id' => $buyer->id,
            'name' => 'ឈិន សុខា (កែប្រែ)',
        ]);
    }

    /** @test */
    public function user_can_update_seller()
    {
        // Create a seller first
        $seller = Seller::factory()->create();
        $document = Document::factory()->create([
            'documentable_id' => $seller->id,
            'documentable_type' => Seller::class,
            'is_display' => true,
        ]);
        
        // Update the seller
        $response = $this->actingAs($this->user)
            ->putJson("/api/sellers/{$seller->id}", [
                'name' => 'ស៊ុន សុភា (កែប្រែ)',
                'sex' => $seller->sex,
                'date_of_birth' => $seller->date_of_birth,
                'identity_number' => $seller->identity_number,
                'address' => $seller->address,
                'phone_number' => $seller->phone_number,
                'documents' => [
                    [
                        'id' => $document->id,
                        'isExisting' => true,
                        'fileName' => $document->file_name,
                        'isDisplay' => true
                    ]
                ]
            ]);
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseHas('sellers', [
            'id' => $seller->id,
            'name' => 'ស៊ុន សុភា (កែប្រែ)',
        ]);
    }

    /** @test */
    public function user_can_update_land()
    {
        // Create a land first
        $land = Land::factory()->create();
        $document = Document::factory()->create([
            'documentable_id' => $land->id,
            'documentable_type' => Land::class,
            'is_display' => true,
        ]);
        
        // Update the land
        $response = $this->actingAs($this->user)
            ->putJson("/api/lands/{$land->id}", [
                'title_deed_number' => $land->title_deed_number,
                'location' => 'ជិតផ្សារថ្មី (កែប្រែ)',
                'province' => $land->province,
                'district' => $land->district,
                'commune' => $land->commune,
                'village' => $land->village,
                'size' => $land->size,
                'size_unit' => $land->size_unit,
                'price_per_unit' => $land->price_per_unit,
                'total_price' => $land->total_price,
                'documents' => [
                    [
                        'id' => $document->id,
                        'isExisting' => true,
                        'fileName' => $document->file_name,
                        'isDisplay' => true
                    ]
                ]
            ]);
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseHas('lands', [
            'id' => $land->id,
            'location' => 'ជិតផ្សារថ្មី (កែប្រែ)',
        ]);
    }

    /** @test */
    public function user_can_delete_buyer()
    {
        // Create a buyer first
        $buyer = Buyer::factory()->create();
        $document = Document::factory()->create([
            'documentable_id' => $buyer->id,
            'documentable_type' => Buyer::class,
        ]);
        
        // Delete the buyer
        $response = $this->actingAs($this->user)
            ->deleteJson("/api/buyers/{$buyer->id}");
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseMissing('buyers', [
            'id' => $buyer->id,
        ]);
        
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);
    }

    /** @test */
    public function user_can_delete_seller()
    {
        // Create a seller first
        $seller = Seller::factory()->create();
        $document = Document::factory()->create([
            'documentable_id' => $seller->id,
            'documentable_type' => Seller::class,
        ]);
        
        // Delete the seller
        $response = $this->actingAs($this->user)
            ->deleteJson("/api/sellers/{$seller->id}");
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseMissing('sellers', [
            'id' => $seller->id,
        ]);
        
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);
    }

    /** @test */
    public function user_can_delete_land()
    {
        // Create a land first
        $land = Land::factory()->create();
        $document = Document::factory()->create([
            'documentable_id' => $land->id,
            'documentable_type' => Land::class,
        ]);
        
        // Delete the land
        $response = $this->actingAs($this->user)
            ->deleteJson("/api/lands/{$land->id}");
        
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        
        $this->assertDatabaseMissing('lands', [
            'id' => $land->id,
        ]);
        
        $this->assertDatabaseMissing('documents', [
            'id' => $document->id,
        ]);
    }
}
