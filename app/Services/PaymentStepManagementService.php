<?php

namespace App\Services;

use App\Models\CommissionPaymentStep;
use Carbon\Carbon;

class PaymentStepManagementService
{
    /**
     * Mark a payment step as paid.
     */
    public function markStepAsPaid(CommissionPaymentStep $paymentStep, int $userId, ?string $notes = null): bool
    {
        try {
            $paymentStep->markAsPaid($userId, $notes);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get overdue payment steps.
     */
    public function getOverduePaymentSteps()
    {
        return CommissionPaymentStep::overdue()
            ->with(['commission', 'commission.creator'])
            ->orderBy('due_date', 'asc')
            ->get();
    }

    /**
     * Get upcoming payment steps (next 30 days).
     */
    public function getUpcomingPaymentSteps()
    {
        $today = Carbon::now();
        $thirtyDaysFromNow = Carbon::now()->addDays(30);

        return CommissionPaymentStep::pending()
            ->whereBetween('due_date', [$today, $thirtyDaysFromNow])
            ->with(['commission', 'commission.creator'])
            ->orderBy('due_date', 'asc')
            ->get();
    }

    /**
     * Get payment step statistics.
     */
    public function getPaymentStepStatistics(): array
    {
        $totalSteps = CommissionPaymentStep::count();
        $paidSteps = CommissionPaymentStep::paid()->count();
        $pendingSteps = CommissionPaymentStep::pending()->count();
        $overdueSteps = CommissionPaymentStep::overdue()->count();

        $totalAmount = CommissionPaymentStep::sum('amount');
        $paidAmount = CommissionPaymentStep::paid()->sum('amount');
        $pendingAmount = CommissionPaymentStep::pending()->sum('amount');
        $overdueAmount = CommissionPaymentStep::overdue()->sum('amount');

        return [
            'steps' => [
                'total' => $totalSteps,
                'paid' => $paidSteps,
                'pending' => $pendingSteps,
                'overdue' => $overdueSteps,
            ],
            'amounts' => [
                'total' => $totalAmount,
                'paid' => $paidAmount,
                'pending' => $pendingAmount,
                'overdue' => $overdueAmount,
            ],
        ];
    }
}
