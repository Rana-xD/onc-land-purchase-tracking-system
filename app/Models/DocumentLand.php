<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentLand extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'document_creation_id',
        'land_id',
        'price_per_m2',
        'total_price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price_per_m2' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Get the document creation that this land belongs to.
     */
    public function documentCreation(): BelongsTo
    {
        return $this->belongsTo(DocumentCreation::class);
    }

    /**
     * Get the land associated with this document.
     */
    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    /**
     * Calculate the total price based on price per m2 and land size.
     */
    public function calculateTotalPrice(): float
    {
        if ($this->price_per_m2 && $this->land) {
            return $this->price_per_m2 * $this->land->size;
        }
        
        return $this->total_price ?? 0;
    }
}
