<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Services\Reports\MonthlyReportService;
use App\Services\Reports\MonthlyExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MonthlyReportController extends Controller
{
    protected $monthlyReportService;
    protected $monthlyExportService;

    public function __construct(
        MonthlyReportService $monthlyReportService,
        MonthlyExportService $monthlyExportService
    ) {
        $this->monthlyReportService = $monthlyReportService;
        $this->monthlyExportService = $monthlyExportService;
    }

    /**
     * Get monthly report data based on date range
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMonthlyData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        try {
            $data = $this->monthlyReportService->getMonthlyReportData($startDate, $endDate);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while generating the monthly report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export monthly report data to PDF or Excel
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function exportMonthlyReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
            'format' => 'required|in:pdf,excel',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $format = $request->input('format');
        $user = Auth::user();

        try {
            $data = $this->monthlyReportService->getMonthlyReportData($startDate, $endDate);
            return $this->monthlyExportService->exportMonthlyReport($data, $format, $startDate, $endDate, $user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while exporting the monthly report: ' . $e->getMessage(),
            ], 500);
        }
    }
}
