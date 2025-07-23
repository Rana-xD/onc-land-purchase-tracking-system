<?php

namespace App\Services;

use App\Models\Commission;
use App\Models\CommissionPaymentStep;

class CommissionCalculationService
{
    /**
     * Validate payment steps for a commission.
     */
    public function validatePaymentSteps(array $paymentSteps, float $totalAmount): array
    {
        $errors = [];
        $stepAmountSum = 0;

        if (empty($paymentSteps)) {
            $errors[] = 'At least one payment step is required for post-purchase commissions.';
            return $errors;
        }

        foreach ($paymentSteps as $index => $step) {
            $stepNumber = $index + 1;

            // Validate amount
            if (!isset($step['amount']) || $step['amount'] <= 0) {
                $errors[] = "Payment step {$stepNumber}: Amount must be greater than 0.";
            } else {
                $stepAmountSum += $step['amount'];
            }

            // Validate due date
            if (!isset($step['due_date']) || empty($step['due_date'])) {
                $errors[] = "Payment step {$stepNumber}: Due date is required.";
            } elseif (strtotime($step['due_date']) < strtotime('today')) {
                $errors[] = "Payment step {$stepNumber}: Due date must be in the future.";
            }
        }

        // Validate total amount matches sum of steps
        if (abs($stepAmountSum - $totalAmount) > 0.01) {
            $errors[] = "The sum of payment step amounts ({$stepAmountSum}) must equal the total commission amount ({$totalAmount}).";
        }

        return $errors;
    }

    /**
     * Create payment steps for a commission.
     */
    public function createPaymentSteps(Commission $commission, array $paymentSteps): void
    {
        foreach ($paymentSteps as $index => $stepData) {
            CommissionPaymentStep::create([
                'commission_id' => $commission->id,
                'step_number' => $index + 1,
                'amount' => $stepData['amount'],
                'due_date' => $stepData['due_date'],
                'status' => 'pending',
            ]);
        }
    }

    /**
     * Update payment steps for a commission.
     */
    public function updatePaymentSteps(Commission $commission, array $paymentSteps): void
    {
        // Delete existing payment steps
        $commission->paymentSteps()->delete();

        // Create new payment steps
        $this->createPaymentSteps($commission, $paymentSteps);

        // Update commission status
        $commission->updateStatus();
    }

    /**
     * Calculate commission statistics.
     */
    public function getCommissionStatistics(): array
    {
        $prePurchaseTotal = Commission::prePurchase()->sum('total_amount');
        $prePurchasePaid = Commission::prePurchase()->where('status', 'paid')->sum('total_amount');
        $prePurchasePending = $prePurchaseTotal - $prePurchasePaid;

        $postPurchaseTotal = Commission::postPurchase()->sum('total_amount');
        $postPurchasePaid = Commission::postPurchase()->where('status', 'paid')->sum('total_amount');
        $postPurchasePartial = Commission::postPurchase()->where('status', 'partial')->sum('total_amount');
        $postPurchasePending = Commission::postPurchase()->where('status', 'pending')->sum('total_amount');

        return [
            'pre_purchase' => [
                'total' => $prePurchaseTotal,
                'paid' => $prePurchasePaid,
                'pending' => $prePurchasePending,
            ],
            'post_purchase' => [
                'total' => $postPurchaseTotal,
                'paid' => $postPurchasePaid,
                'partial' => $postPurchasePartial,
                'pending' => $postPurchasePending,
            ],
            'overall' => [
                'total' => $prePurchaseTotal + $postPurchaseTotal,
                'paid' => $prePurchasePaid + $postPurchasePaid,
                'pending' => $prePurchasePending + $postPurchasePending + $postPurchasePartial,
            ],
        ];
    }
}
