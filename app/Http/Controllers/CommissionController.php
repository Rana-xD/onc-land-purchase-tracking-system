<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use App\Services\CommissionCalculationService;
use Illuminate\Http\Request;
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
        return Inertia::render('Commission/PrePurchaseCommission');
    }

    /**
     * Display the post-purchase commission page.
     */
    public function postPurchase()
    {
        return Inertia::render('Commission/PostPurchaseCommission');
    }

    /**
     * Display the create post-purchase commission page.
     */
    public function createPostPurchase()
    {
        return Inertia::render('Commission/CreatePostPurchaseCommission');
    }

    /**
     * Display the edit post-purchase commission page.
     */
    public function editPostPurchase(Commission $commission)
    {
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
    public function manageSteps(Commission $commission)
    {
        if ($commission->commission_type !== 'post_purchase') {
            return redirect()->route('commissions.post-purchase')
                ->with('error', 'Commission not found');
        }

        return Inertia::render('Commission/ManagePaymentSteps', [
            'commission' => $commission->load(['creator', 'paymentSteps.paidBy']),
        ]);
    }
}
