<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentStep extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'document_creation_id',
        'step_number',
        'payment_time_description',
        'amount',
        'due_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'step_number' => 'integer',
    ];

    /**
     * Get the document creation that this payment step belongs to.
     */
    public function documentCreation(): BelongsTo
    {
        return $this->belongsTo(DocumentCreation::class);
    }
}
