<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use App\Services\CommissionCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PrePurchaseCommissionController extends Controller
{
    protected $commissionService;

    public function __construct(CommissionCalculationService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    /**
     * Display a listing of pre-purchase commissions.
     */
    public function index(Request $request)
    {
        $query = Commission::prePurchase()->with('creator');

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
     * Store a newly created pre-purchase commission.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $commission = Commission::create([
                'commission_type' => 'pre_purchase',
                'recipient_name' => $request->recipient_name,
                'total_amount' => $request->total_amount,
                'description' => $request->description,
                'status' => 'pending',
                'created_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'បានបន្ថែមកុំស្យុងដោយជោគជ័យ',
                'commission' => $commission->load('creator'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការបន្ថែមកុំស្យុង',
            ], 500);
        }
    }

    /**
     * Display the specified pre-purchase commission.
     */
    public function show(Commission $commission)
    {
        if ($commission->commission_type !== 'pre_purchase') {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'commission' => $commission->load('creator'),
        ]);
    }

    /**
     * Update the specified pre-purchase commission.
     */
    public function update(Request $request, Commission $commission)
    {
        if ($commission->commission_type !== 'pre_purchase') {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $commission->update([
                'recipient_name' => $request->recipient_name,
                'total_amount' => $request->total_amount,
                'description' => $request->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'បានកែប្រែកុំស្យុងដោយជោគជ័យ',
                'commission' => $commission->load('creator'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការកែប្រែកុំស្យុង',
            ], 500);
        }
    }

    /**
     * Remove the specified pre-purchase commission.
     */
    public function destroy(Commission $commission)
    {
        if ($commission->commission_type !== 'pre_purchase') {
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
     * Mark the specified pre-purchase commission as paid.
     */
    public function markAsPaid(Commission $commission)
    {
        if ($commission->commission_type !== 'pre_purchase') {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found',
            ], 404);
        }

        try {
            $commission->update(['status' => 'paid']);

            return response()->json([
                'success' => true,
                'message' => 'បានបញ្ជាក់ការទូទាត់ដោយជោគជ័យ',
                'commission' => $commission->load('creator'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'មានបញ្ហាក្នុងការបញ្ជាក់ការទូទាត់',
            ], 500);
        }
    }
}
