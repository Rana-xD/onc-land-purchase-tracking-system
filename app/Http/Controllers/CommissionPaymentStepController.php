<?php

namespace App\Http\Controllers;

use App\Models\CommissionPaymentStep;
use App\Services\PaymentStepManagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommissionPaymentStepController extends Controller
{
    protected $paymentStepService;

    public function __construct(PaymentStepManagementService $paymentStepService)
    {
        $this->paymentStepService = $paymentStepService;
    }

    /**
     * Mark a payment step as paid.
     */
    public function markAsPaid(Request $request, CommissionPaymentStep $paymentStep)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($paymentStep->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'ជំហាននេះត្រូវបានទូទាត់រួចហើយ',
            ], 400);
        }

        try {
            $success = $this->paymentStepService->markStepAsPaid(
                $paymentStep,
                Auth::id(),
                $request->notes
            );

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'បានបញ្ជាក់ការទូទាត់ដោយជោគជ័យ',
                    'payment_step' => $paymentStep->fresh()->load(['commission', 'paidBy']),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'មានបញ្ហាក្នុងការបញ្ជាក់ការទូទាត់',
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការបញ្ជាក់ការទូទាត់',
            ], 500);
        }
    }

    /**
     * Get overdue payment steps.
     */
    public function getOverdueSteps()
    {
        $overdueSteps = $this->paymentStepService->getOverduePaymentSteps();

        return response()->json([
            'success' => true,
            'overdue_steps' => $overdueSteps,
        ]);
    }

    /**
     * Get upcoming payment steps.
     */
    public function getUpcomingSteps()
    {
        $upcomingSteps = $this->paymentStepService->getUpcomingPaymentSteps();

        return response()->json([
            'success' => true,
            'upcoming_steps' => $upcomingSteps,
        ]);
    }

    /**
     * Get payment step statistics.
     */
    public function getStatistics()
    {
        $statistics = $this->paymentStepService->getPaymentStepStatistics();

        return response()->json([
            'success' => true,
            'statistics' => $statistics,
        ]);
    }
}
