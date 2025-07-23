<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CommissionPaymentStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'commission_id',
        'step_number',
        'amount',
        'due_date',
        'status',
        'paid_date',
        'paid_by',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the commission that owns this payment step.
     */
    public function commission()
    {
        return $this->belongsTo(Commission::class);
    }

    /**
     * Get the user who marked this step as paid.
     */
    public function paidBy()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    /**
     * Mark this payment step as paid.
     */
    public function markAsPaid($userId, $notes = null)
    {
        $this->status = 'paid';
        $this->paid_date = Carbon::now();
        $this->paid_by = $userId;
        $this->notes = $notes;
        $this->save();

        // Update the commission status
        $this->commission->updateStatus();
    }

    /**
     * Check if this payment step is overdue.
     */
    public function isOverdue()
    {
        return $this->status === 'pending' && $this->due_date < Carbon::now();
    }

    /**
     * Scope for pending payment steps.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for paid payment steps.
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope for overdue payment steps.
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'pending')
                    ->where('due_date', '<', Carbon::now());
    }
}
