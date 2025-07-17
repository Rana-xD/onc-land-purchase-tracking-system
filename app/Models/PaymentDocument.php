<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentDocument extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payment_step_id',
        'document_type',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'uploaded_by',
        'uploaded_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_size' => 'integer',
        'uploaded_at' => 'datetime',
    ];

    /**
     * Get the payment step that this document belongs to.
     */
    public function paymentStep(): BelongsTo
    {
        return $this->belongsTo(PaymentStep::class);
    }

    /**
     * Get the user who uploaded this document.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Check if this document is a payment contract.
     */
    public function isPaymentContract(): bool
    {
        return $this->document_type === 'payment_contract';
    }

    /**
     * Check if this document is payment evidence.
     */
    public function isPaymentEvidence(): bool
    {
        return $this->document_type === 'payment_evidence';
    }
    
    /**
     * Check if this document is a land certificate.
     */
    public function isLandCertificate(): bool
    {
        return $this->document_type === 'land_certificate';
    }
    
    /**
     * Check if this document is an other document.
     */
    public function isOtherDocument(): bool
    {
        return $this->document_type === 'other_document';
    }
}
