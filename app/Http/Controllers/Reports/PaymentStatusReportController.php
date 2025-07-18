<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Services\Reports\PaymentStatusReportService;
use App\Services\Reports\PaymentStatusExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PaymentStatusReportController extends Controller
{
    protected $paymentStatusReportService;
    protected $paymentStatusExportService;

    public function __construct(
        PaymentStatusReportService $paymentStatusReportService,
        PaymentStatusExportService $paymentStatusExportService
    ) {
        $this->paymentStatusReportService = $paymentStatusReportService;
        $this->paymentStatusExportService = $paymentStatusExportService;
    }

    /**
     * Get payment status report data
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPaymentStatusData(Request $request)
    {
        try {
            Log::info('Payment Status Report API - Request received');
            $data = $this->paymentStatusReportService->getPaymentStatusReportData();
            
            // Debug: Log the response data structure
            Log::info('Payment Status Report API - Response data', [
                'contracts_count' => count($data['contracts'] ?? []),
                'has_summary' => isset($data['summary']),
                'has_error' => isset($data['error'])
            ]);
            
            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Payment Status Report API - Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while generating the payment status report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export payment status report data to PDF or Excel
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function exportPaymentStatusReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'format' => 'required|in:pdf,excel',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $format = $request->input('format');
        $user = Auth::user();

        try {
            $data = $this->paymentStatusReportService->getPaymentStatusReportData();
            return $this->paymentStatusExportService->exportPaymentStatusReport($data, $format, $user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while exporting the payment status report: ' . $e->getMessage(),
            ], 500);
        }
    }
}
