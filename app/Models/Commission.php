<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    protected $fillable = [
        'commission_type',
        'recipient_name',
        'total_amount',
        'description',
        'status',
        'created_by',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the payment steps for post-purchase commissions.
     */
    public function paymentSteps()
    {
        return $this->hasMany(CommissionPaymentStep::class);
    }

    /**
     * Get the user who created this commission.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Update commission status based on payment steps.
     */
    public function updateStatus()
    {
        if ($this->commission_type === 'pre_purchase') {
            // Pre-purchase commissions don't have payment steps
            return;
        }

        $paymentSteps = $this->paymentSteps;
        $totalSteps = $paymentSteps->count();
        $paidSteps = $paymentSteps->where('status', 'paid')->count();

        if ($paidSteps === 0) {
            $this->status = 'pending';
        } elseif ($paidSteps === $totalSteps) {
            $this->status = 'paid';
        } else {
            $this->status = 'partial';
        }

        $this->save();
    }

    /**
     * Scope for pre-purchase commissions.
     */
    public function scopePrePurchase($query)
    {
        return $query->where('commission_type', 'pre_purchase');
    }

    /**
     * Scope for post-purchase commissions.
     */
    public function scopePostPurchase($query)
    {
        return $query->where('commission_type', 'post_purchase');
    }
}
