<?php

namespace App\Http\Controllers;

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
}
