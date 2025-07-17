<?php

namespace App\Services\Reports;

use App\Models\SaleContract;
use App\Models\User;
use App\Services\Reports\PermissionCheckService;

class ContractSearchService
{
    protected $permissionCheckService;

    public function __construct(PermissionCheckService $permissionCheckService)
    {
        $this->permissionCheckService = $permissionCheckService;
    }

    /**
     * Search for a contract by contract ID
     *
     * @param string $contractId
     * @param User $user
     * @return array|null
     */
    public function searchByContractId(string $contractId, User $user): ?array
    {
        // Find the contract by document_code in the related DocumentCreation
        $contract = SaleContract::with([
            'documentCreation.paymentSteps',
            'land',
        ])->whereHas('documentCreation', function($query) use ($contractId) {
            $query->where('document_code', $contractId);
        })->first();

        if (!$contract) {
            return null;
        }

        // Get payment steps and check permissions for each step
        $paymentSteps = $contract->documentCreation->paymentSteps->map(function ($step) use ($user) {
            return [
                'id' => $step->id,
                'step_number' => $step->step_number,
                'payment_description' => $step->payment_time_description,
                'amount' => $step->amount,
                'due_date' => $step->due_date->format('Y-m-d'),
                'payment_contract_created' => $step->payment_contract_created,
                'status' => $step->status,
                'can_create_contract' => $this->permissionCheckService->canCreatePaymentContract($user, $step),
            ];
        });

        // Format the contract data
        return [
            'contract' => [
                'contract_id' => $contract->contract_id,
                'buyer_info' => [
                    'name' => $contract->buyer_name,
                    'phone' => $contract->buyer_phone,
                    'address' => $contract->buyer_address,
                ],
                'seller_info' => [
                    'name' => $contract->seller_name,
                    'phone' => $contract->seller_phone,
                    'address' => $contract->seller_address,
                ],
                'land_info' => [
                    'id' => $contract->land->id,
                    'plot_number' => $contract->land->plot_number ?? 'N/A',
                    'size' => $contract->land->size ?? 'N/A',
                    'location' => $contract->land->location ?? 'N/A',
                ],
                'total_amount' => $contract->total_amount,
                'contract_date' => $contract->contract_date->format('Y-m-d'),
                'status' => $contract->status,
            ],
            'payment_steps' => $paymentSteps,
        ];
    }
}
