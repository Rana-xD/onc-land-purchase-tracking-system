<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use App\Models\CommissionPaymentStep;
use App\Services\CommissionCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PostPurchaseCommissionController extends Controller
{
    protected $commissionService;

    public function __construct(CommissionCalculationService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    /**
     * Display a listing of post-purchase commissions.
     */
    public function index(Request $request)
    {
        $query = Commission::postPurchase()->with(['creator', 'paymentSteps']);

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('recipient_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        $commissions = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'commissions' => $commissions->items(),
            'pagination' => [
                'current_page' => $commissions->currentPage(),
                'last_page' => $commissions->lastPage(),
                'per_page' => $commissions->perPage(),
                'total' => $commissions->total(),
            ],
        ]);
    }

    /**
     * Store a newly created post-purchase commission.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'payment_steps' => 'required|array|min:1',
            'payment_steps.*.amount' => 'required|numeric|min:0.01',
            'payment_steps.*.due_date' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Validate payment steps
        $validationErrors = $this->commissionService->validatePaymentSteps(
            $request->payment_steps,
            $request->total_amount
        );

        if (!empty($validationErrors)) {
            return response()->json([
                'success' => false,
                'errors' => ['payment_steps' => $validationErrors],
            ], 422);
        }

        try {
            DB::beginTransaction();

            $commission = Commission::create([
                'commission_type' => 'post_purchase',
                'recipient_name' => $request->recipient_name,
                'total_amount' => $request->total_amount,
                'description' => $request->description,
                'status' => 'pending',
                'created_by' => Auth::id(),
            ]);

            $this->commissionService->createPaymentSteps($commission, $request->payment_steps);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'បានបន្ថែមកុំស្យុងដោយជោគជ័យ',
                'commission' => $commission->load(['creator', 'paymentSteps']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការបន្ថែមកុំស្យុង',
            ], 500);
        }
    }

    /**
     * Display the specified post-purchase commission.
     */
    public function show(Commission $commission)
    {
        if ($commission->commission_type !== 'post_purchase') {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'commission' => $commission->load(['creator', 'paymentSteps.paidBy']),
        ]);
    }

    /**
     * Update the specified post-purchase commission.
     */
    public function update(Request $request, Commission $commission)
    {
        if ($commission->commission_type !== 'post_purchase') {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'payment_steps' => 'required|array|min:1',
            'payment_steps.*.amount' => 'required|numeric|min:0.01',
            'payment_steps.*.due_date' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Validate payment steps
        $validationErrors = $this->commissionService->validatePaymentSteps(
            $request->payment_steps,
            $request->total_amount
        );

        if (!empty($validationErrors)) {
            return response()->json([
                'success' => false,
                'errors' => ['payment_steps' => $validationErrors],
            ], 422);
        }

        try {
            DB::beginTransaction();

            $commission->update([
                'recipient_name' => $request->recipient_name,
                'total_amount' => $request->total_amount,
                'description' => $request->description,
            ]);

            $this->commissionService->updatePaymentSteps($commission, $request->payment_steps);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'បានកែប្រែកុំស្យុងដោយជោគជ័យ',
                'commission' => $commission->load(['creator', 'paymentSteps']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការកែប្រែកុំស្យុង',
            ], 500);
        }
    }

    /**
     * Remove the specified post-purchase commission.
     */
    public function destroy(Commission $commission)
    {
        if ($commission->commission_type !== 'post_purchase') {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found',
            ], 404);
        }

        try {
            $commission->delete();

            return response()->json([
                'success' => true,
                'message' => 'បានលុបកុំស្យុងដោយជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការលុបកុំស្យុង',
            ], 500);
        }
    }

    /**
     * Get payment steps for a specific commission.
     */
    public function getPaymentSteps(Commission $commission)
    {
        if ($commission->commission_type !== 'post_purchase') {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found',
            ], 404);
        }

        $paymentSteps = $commission->paymentSteps()->with('paidBy')->orderBy('step_number')->get();

        return response()->json([
            'success' => true,
            'payment_steps' => $paymentSteps,
            'commission' => $commission->load('creator'),
        ]);
    }
}
