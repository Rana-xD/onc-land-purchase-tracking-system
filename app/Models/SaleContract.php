<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\PaymentStep;
use App\Models\DocumentCreation;

class SaleContract extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'contract_id',
        'document_creation_id',
        'land_id',
        'buyer_name',
        'buyer_phone',
        'buyer_address',
        'seller_name',
        'seller_phone',
        'seller_address',
        'total_amount',
        'contract_date',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'decimal:2',
        'contract_date' => 'date',
    ];

    /**
     * Get the document creation that this sale contract belongs to.
     */
    public function documentCreation(): BelongsTo
    {
        return $this->belongsTo(DocumentCreation::class);
    }

    /**
     * Get the land that this sale contract is for.
     */
    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    /**
     * Get the payment steps for this sale contract through the document creation.
     */
    public function paymentSteps(): HasManyThrough
    {
        return $this->hasManyThrough(
            PaymentStep::class,
            DocumentCreation::class,
            'id', // Foreign key on DocumentCreation table
            'document_creation_id', // Foreign key on PaymentStep table
            'document_creation_id', // Local key on SaleContract table
            'id' // Local key on DocumentCreation table
        );
    }

    /**
     * Get the documents associated with this sale contract.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(ContractDocument::class, 'sale_contract_id');
    }

    /**
     * Check if this contract is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if this contract is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if this contract is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
