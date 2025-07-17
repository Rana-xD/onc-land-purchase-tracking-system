<?php

namespace App\Services\Reports;

use App\Models\PaymentStep;
use App\Models\User;

class PermissionCheckService
{
    /**
     * Check if a user can create a payment contract for a payment step
     *
     * @param User $user
     * @param PaymentStep $paymentStep
     * @return bool
     */
    public function canCreatePaymentContract(User $user, PaymentStep $paymentStep): bool
    {
        // If contract is already created, return false
        if ($paymentStep->payment_contract_created) {
            return false;
        }

        // Admin users can create contracts at any time
        if ($user->is_admin) {
            return true;
        }

        // Regular users can only create contracts on or after the due date
        return now()->startOfDay()->gte($paymentStep->due_date);
    }

    /**
     * Check if a user can upload documents for a payment step
     *
     * @param User $user
     * @param PaymentStep $paymentStep
     * @return bool
     */
    public function canUploadDocuments(User $user, PaymentStep $paymentStep): bool
    {
        // All authenticated users can upload documents
        return true;
    }

    /**
     * Check if a user can view documents for a payment step
     *
     * @param User $user
     * @param PaymentStep $paymentStep
     * @return bool
     */
    public function canViewDocuments(User $user, PaymentStep $paymentStep): bool
    {
        // All authenticated users can view documents
        return true;
    }

    /**
     * Check if a user can export contract data
     *
     * @param User $user
     * @return bool
     */
    public function canExportContractData(User $user): bool
    {
        // All authenticated users can export contract data
        return true;
    }
}
