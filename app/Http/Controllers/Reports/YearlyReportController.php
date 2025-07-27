<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Services\Reports\YearlyReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class YearlyReportController extends Controller
{
    protected $yearlyReportService;

    /**
     * Create a new controller instance.
     *
     * @param YearlyReportService $yearlyReportService
     */
    public function __construct(YearlyReportService $yearlyReportService)
    {
        $this->yearlyReportService = $yearlyReportService;
    }

    /**
     * Get yearly report data for the specified year
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getYearlyData(Request $request)
    {
        try {
            $year = $request->input('year', Carbon::now()->year);
            
            $data = $this->yearlyReportService->generateYearlyReport($year);
            
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error generating yearly report: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate yearly report'], 500);
        }
    }

    /**
     * Export yearly report as PDF or Excel
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportYearlyReport(Request $request)
    {
        try {
            $format = $request->input('format', 'pdf');
            $year = $request->input('year', Carbon::now()->year);
            $user = Auth::user();
            
            $response = $this->yearlyReportService->exportYearlyReport($year, $format, $user);
            
            return $response;
        } catch (\Exception $e) {
            Log::error('Error exporting yearly report: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to export yearly report'], 500);
        }
    }
}
