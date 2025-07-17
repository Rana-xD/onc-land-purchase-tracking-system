<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\PaymentStep;
use App\Services\Reports\PaymentContractGenerationService;
use App\Services\Reports\PermissionCheckService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PaymentStepController extends Controller
{
    protected $paymentContractGenerationService;
    protected $permissionCheckService;

    public function __construct(
        PaymentContractGenerationService $paymentContractGenerationService,
        PermissionCheckService $permissionCheckService
    ) {
        $this->paymentContractGenerationService = $paymentContractGenerationService;
        $this->permissionCheckService = $permissionCheckService;
    }

    /**
     * Create a payment contract for a payment step
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $stepId
     * @return \Illuminate\Http\JsonResponse
     */
    public function createContract(Request $request, $stepId)
    {
        $user = Auth::user();
        $paymentStep = PaymentStep::findOrFail($stepId);

        // Check if user has permission to create a contract for this step
        if (!$this->permissionCheckService->canCreatePaymentContract($user, $paymentStep)) {
            return response()->json([
                'error' => 'You do not have permission to create a payment contract for this step',
            ], 403);
        }

        try {
            $result = $this->paymentContractGenerationService->generateContract($paymentStep, $user);
            
            return response()->json([
                'success' => true,
                'message' => 'Payment contract created successfully',
                'file_path' => $result['file_path'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the payment contract: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get documents for a payment step
     *
     * @param  int  $stepId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDocuments($stepId)
    {
        $paymentStep = PaymentStep::with('documents')->findOrFail($stepId);

        return response()->json([
            'documents' => $paymentStep->documents,
        ]);
    }
    
    /**
     * Mark a payment step as paid.
     *
     * @param int $stepId
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsPaid($stepId)
    {
        $paymentStep = PaymentStep::findOrFail($stepId);
        
        // Check if user is admin or created the payment step
        $user = Auth::user();
        if (!$user->is_admin && $paymentStep->documentCreation->created_by !== $user->id) {
            return response()->json(['error' => 'អ្នកមិនមានសិទ្ធិកំណត់ដំណាក់កាលនេះថាបានបង់ប្រាក់ទេ'], 403);
        }
        
        // Check if already paid
        if ($paymentStep->status === 'paid') {
            return response()->json(['message' => 'ដំណាក់កាលនេះបានបង់ប្រាក់រួចហើយ', 'payment_step' => $paymentStep]);
        }
        
        // Update payment step status
        $paymentStep->status = 'paid';
        $paymentStep->save();
        
        return response()->json(['message' => 'ដំណាក់កាលបានកំណត់ថាបានបង់ប្រាក់ហើយ', 'payment_step' => $paymentStep]);
    }
}
