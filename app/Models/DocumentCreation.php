<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentCreation extends Model
{
    use HasFactory;

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
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_land_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'deposit_months' => 'integer',
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
}
