<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentBuyer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'document_creation_id',
        'buyer_id',
    ];

    /**
     * Get the document creation that this buyer belongs to.
     */
    public function documentCreation(): BelongsTo
    {
        return $this->belongsTo(DocumentCreation::class);
    }

    /**
     * Get the buyer associated with this document.
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Buyer::class);
    }
}
