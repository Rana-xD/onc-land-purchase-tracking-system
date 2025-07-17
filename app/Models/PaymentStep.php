<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'payment_contract_created',
        'payment_contract_created_at',
        'payment_contract_created_by',
        'status',
    ];
    
    /**
     * The attributes that should be set to their default values.
     *
     * @var array
     */
    protected $attributes = [
        'status' => 'unpaid',
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
        'payment_contract_created' => 'boolean',
        'payment_contract_created_at' => 'datetime',
        'status' => 'string',
    ];
    
    /**
     * The possible status values for payment steps.
     *
     * @var array<string>
     */
    public static $statuses = [
        'unpaid' => 'មិនទាន់បង់ប្រាក់',
        'paid' => 'បង់ប្រាក់រួចរាល់',
    ];

    /**
     * Get the document creation that this payment step belongs to.
     */
    public function documentCreation(): BelongsTo
    {
        return $this->belongsTo(DocumentCreation::class);
    }

    /**
     * Get the user who created the payment contract.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payment_contract_created_by');
    }

    /**
     * Get the documents associated with this payment step.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(PaymentDocument::class);
    }

    /**
     * Check if a payment contract can be created for this step.
     * Regular users can only create contracts on or after the due date.
     * Admin users can create contracts at any time.
     *
     * @param \App\Models\User $user
     * @return bool
     */
    public function canCreateContract(User $user): bool
    {
        // If contract is already created, return false
        if ($this->payment_contract_created) {
            return false;
        }

        // Admin users can create contracts at any time
        if ($user->is_admin) {
            return true;
        }

        // Regular users can only create contracts on or after the due date
        return now()->startOfDay()->gte($this->due_date);
    }
}
