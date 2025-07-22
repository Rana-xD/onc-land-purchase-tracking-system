<?php

namespace App\Http\Controllers;

use App\Models\DocumentCreation;
use Illuminate\Http\Request;
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
        return Inertia::render('Reports/DocumentReport');
    }

    /**
     * Show the Monthly Report page.
     *
     * @return \Inertia\Response
     */
    public function monthlyReport()
    {
        return Inertia::render('Reports/MonthlyReport');
    }

    /**
     * Show the Payment Status Report page.
     *
     * @return \Inertia\Response
     */
    public function paymentStatusReport()
    {
        return Inertia::render('Reports/PaymentStatusReport');
    }
    
    /**
     * Show the Yearly Report page.
     *
     * @return \Inertia\Response
     */
    public function yearlyReport()
    {
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
        // Find the contract by document_code (which is displayed as contract_id in the UI)
        $contract = DocumentCreation::where('document_code', $contract_id)->first();
        
        // Pass the contract data to the view, or null if not found
        return Inertia::render('Reports/ContractDocumentReport', [
            'contract' => $contract,
            'contract_id' => $contract_id
        ]);
    }
}
