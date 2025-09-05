<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentCreation extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'document_type',
        'created_by',
        'status',
        'total_land_price',
        'deposit_amount',
        'deposit_months',
        'document_code',
        'document_content',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_land_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
    ];

    /**
     * Get the user who created this document.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the buyers associated with this document.
     */
    public function buyers(): HasMany
    {
        return $this->hasMany(DocumentBuyer::class);
    }

    /**
     * Get the sellers associated with this document.
     */
    public function sellers(): HasMany
    {
        return $this->hasMany(DocumentSeller::class);
    }

    /**
     * Get the lands associated with this document.
     */
    public function lands(): HasMany
    {
        return $this->hasMany(DocumentLand::class);
    }

    /**
     * Get the payment steps for this document (for sale contracts).
     */
    public function paymentSteps(): HasMany
    {
        return $this->hasMany(PaymentStep::class);
    }

    /**
     * Check if this is a deposit contract.
     */
    public function isDepositContract(): bool
    {
        return $this->document_type === 'deposit_contract';
    }

    /**
     * Check if this is a sale contract.
     */
    public function isSaleContract(): bool
    {
        return $this->document_type === 'sale_contract';
    }
    
    /**
     * Get the sale contract associated with this document.
     */
    public function saleContract()
    {
        return $this->hasOne(SaleContract::class);
    }
    
    /**
     * The "booted" method of the model.
     * Automatically generate document_code when creating a new document.
     */
    protected static function booted()
    {
        static::creating(function ($document) {
            // Generate document code in format [YYMMDD]-[Sequential Number]
            // Get today's date in YYMMDD format
            $dateCode = now()->format('ymd');
            
            // Find the latest document with the same date code to determine the next sequence number
            $latestDocument = static::where('document_code', 'like', $dateCode . '-%')
                ->orderByRaw('CAST(SUBSTRING(document_code, 8) AS UNSIGNED) DESC')
                ->first();
            
            // Extract the sequence number and increment it, or start at 0001 if no documents exist for today
            $sequenceNumber = 1;
            if ($latestDocument) {
                $parts = explode('-', $latestDocument->document_code);
                if (count($parts) > 1) {
                    $sequenceNumber = (int)$parts[1] + 1;
                }
            }
            
            // Format the sequence number with leading zeros to ensure 4 digits
            $formattedSequence = str_pad($sequenceNumber, 4, '0', STR_PAD_LEFT);
            
            // Set the document code
            $document->document_code = $dateCode . '-' . $formattedSequence;
        });
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
