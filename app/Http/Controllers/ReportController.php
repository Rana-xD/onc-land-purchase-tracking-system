<?php

namespace App\Http\Controllers;

use App\Models\DocumentCreation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Show the Document Report page.
     *
     * @return \Inertia\Response
     */
    public function documentReport()
    {
        // Check if user has permission to view document reports
        if (!Auth::user()->hasPermission('reports.document')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Reports/DocumentReport');
    }

    /**
     * Show the Monthly Report page.
     *
     * @return \Inertia\Response
     */
    public function monthlyReport()
    {
        // Check if user has permission to view monthly reports
        if (!Auth::user()->hasPermission('reports.monthly')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Reports/MonthlyReport');
    }

    /**
     * Show the Payment Status Report page.
     *
     * @return \Inertia\Response
     */
    public function paymentStatusReport()
    {
        // Check if user has permission to view payment status reports
        if (!Auth::user()->hasPermission('reports.payment_status')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Reports/PaymentStatusReport');
    }
    
    /**
     * Show the Yearly Report page.
     *
     * @return \Inertia\Response
     */
    public function yearlyReport()
    {
        // Check if user has permission to view yearly reports
        if (!Auth::user()->hasPermission('reports.yearly')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Reports/YearlyReport');
    }
    
    /**
     * Show the Document Report page for a specific contract.
     *
     * @param string $contract_id
     * @return \Inertia\Response
     */
    public function documentReportByContract($contract_id)
    {
        // Check if user has permission to view document reports
        if (!Auth::user()->hasPermission('reports.document')) {
            abort(403, 'Unauthorized');
        }

        // Pass the contract_id to the detail view
        return Inertia::render('Reports/ContractDetail', [
            'contract_id' => $contract_id
        ]);
    }
}
