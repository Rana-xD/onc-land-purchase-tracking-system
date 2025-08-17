<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use App\Services\CommissionCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommissionController extends Controller
{
    protected $commissionService;

    public function __construct(CommissionCalculationService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    /**
     * Display the commission management page.
     */
    public function index()
    {
        // Check if user has permission to view commission management
        if (!Auth::user()->hasPermission('pre_purchase_commission.view')) {
            abort(403, 'Unauthorized');
        }

        $statistics = $this->commissionService->getCommissionStatistics();

        return Inertia::render('Commission/CommissionManagement', [
            'statistics' => $statistics,
        ]);
    }

    /**
     * Display the pre-purchase commission page.
     */
    public function prePurchase()
    {
        // Check if user has permission to view pre-purchase commissions
        if (!Auth::user()->hasPermission('pre_purchase_commission.view')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Commission/PrePurchaseCommission');
    }

    /**
     * Display the post-purchase commission page.
     */
    public function postPurchase()
    {
        // Check if user has permission to view post-purchase commissions
        if (!Auth::user()->hasPermission('post_purchase_commission.view')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Commission/PostPurchaseCommission');
    }

    /**
     * Display the create post-purchase commission page.
     */
    public function createPostPurchase()
    {
        // Check if user has permission to create post-purchase commissions
        if (!Auth::user()->hasPermission('post_purchase_commission.create')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Commission/CreatePostPurchaseCommission');
    }

    /**
     * Display the edit post-purchase commission page.
     */
    public function editPostPurchase(Commission $commission)
    {
        // Check if user has permission to edit post-purchase commissions
        if (!Auth::user()->hasPermission('post_purchase_commission.edit')) {
            abort(403, 'Unauthorized');
        }

        if ($commission->commission_type !== 'post_purchase') {
            return redirect()->route('commissions.post-purchase')
                ->with('error', 'Commission not found');
        }

        return Inertia::render('Commission/EditPostPurchaseCommission', [
            'commission' => $commission->load(['creator', 'paymentSteps']),
        ]);
    }

    /**
     * Display the payment steps management page.
     */
    public function managePaymentSteps(Commission $commission)
    {
        // Check if user has permission to manage commission payment steps
        if (!Auth::user()->hasPermission('post_purchase_commission.edit')) {
            abort(403, 'Unauthorized');
        }

        if ($commission->commission_type !== 'post_purchase') {
            return redirect()->route('commissions.post-purchase')
                ->with('error', 'Commission not found');
        }

        return Inertia::render('Commission/ManagePaymentSteps', [
            'commission' => $commission->load(['creator', 'paymentSteps.paidBy']),
        ]);
    }
}
