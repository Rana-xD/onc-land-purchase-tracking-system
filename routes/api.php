<?php

use App\Http\Controllers\Reports\DocumentReportController;
use App\Http\Controllers\Reports\MonthlyReportController;
use App\Http\Controllers\Reports\ContractDocumentController;
use App\Http\Controllers\Reports\PaymentStepController;
use App\Http\Controllers\Reports\PaymentStatusReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Reports API Routes
Route::prefix('reports')->group(function () {
    // Document Report
    Route::prefix('document')->group(function () {
        Route::post('/search', [DocumentReportController::class, 'search']);
        Route::get('/export/{contractId}', [DocumentReportController::class, 'export']);
    });
    
    // Monthly Report
    Route::prefix('monthly')->group(function () {
        Route::post('/data', [MonthlyReportController::class, 'getMonthlyData']);
        Route::post('/export', [MonthlyReportController::class, 'exportMonthlyReport']);
    });
    
    // Payment Status Report
    Route::prefix('payment-status')->group(function () {
        Route::post('/data', [PaymentStatusReportController::class, 'getPaymentStatusData']);
        Route::post('/export', [PaymentStatusReportController::class, 'exportPaymentStatusReport']);
    });
    
    // Commission routes
    Route::prefix('commission')->group(function () {
        Route::get('/payment-steps/{document}', [CommissionController::class, 'getPaymentSteps']);
        Route::post('/payment-steps/{document}', [CommissionController::class, 'savePaymentSteps']);
        Route::patch('/payment-steps/{step}/mark-paid', [CommissionController::class, 'markAsPaid']);
        Route::patch('/payment-steps/{step}/mark-unpaid', [CommissionController::class, 'markAsUnpaid']);
    });

    // Contract report routes
    Route::get('/contracts/report-list', [ContractReportController::class, 'apiList']);

    // Payment Steps
    Route::prefix('payment-steps')->group(function () {
        Route::post('/{stepId}/create-contract', [PaymentStepController::class, 'createContract']);
        Route::get('/{stepId}/documents', [PaymentStepController::class, 'getDocuments']);
        Route::post('/{stepId}/mark-as-paid', [PaymentStepController::class, 'markAsPaid']);
    });
    
    // Contract Documents
    Route::prefix('contract-documents')->group(function () {
        Route::get('/', [ContractDocumentController::class, 'index']); // Get all documents
        Route::post('/{contractId}/upload', [ContractDocumentController::class, 'upload']);
        Route::get('/{documentId}/download', [ContractDocumentController::class, 'download']);
        Route::delete('/{documentId}', [ContractDocumentController::class, 'delete']);
    });
});
