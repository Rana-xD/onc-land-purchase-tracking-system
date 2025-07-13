<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentSeller extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'document_creation_id',
        'seller_id',
    ];

    /**
     * Get the document creation that this seller belongs to.
     */
    public function documentCreation(): BelongsTo
    {
        return $this->belongsTo(DocumentCreation::class);
    }

    /**
     * Get the seller associated with this document.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }
}
