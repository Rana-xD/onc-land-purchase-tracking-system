<?php

use App\Http\Controllers\Api\BuyerApiController;
use App\Http\Controllers\Api\BuyerController;
use App\Http\Controllers\Api\DocumentCreationController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\LandApiController;
use App\Http\Controllers\Api\LandController;
use App\Http\Controllers\Api\SellerApiController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataEntryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Reports\ContractDocumentController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirect root to dashboard if authenticated, otherwise to login page
Route::get('/', function () {
    return Auth::check() ? redirect('/dashboard') : Inertia::render('Auth/Login');
});

// Dashboard accessible to all authenticated users
Route::middleware(['auth', 'verified', 'web'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Dashboard API endpoints
    Route::prefix('api/dashboard')->group(function () {
        Route::get('/payment-overview', [DashboardController::class, 'paymentOverview']);
        Route::get('/upcoming-payments', [DashboardController::class, 'upcomingPayments']);
    });
    
    // Contract Documents API endpoints
    Route::prefix('api/reports')->group(function () {
        Route::get('/contract-documents', [ContractDocumentController::class, 'index']);
    });
});

// Routes for all authenticated users
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // User routes
    
    // User routes with role-based access control
    Route::middleware('role:administrator,manager')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        
        // Administrator and manager routes
    });
    
    // User management page - with auth middleware only
    Route::middleware('auth')->get('/user-management', function () {
        return Inertia::render('Users/UserManagement');
    })->name('users.management');
    
    // Simple test routes
    Route::get('/test-page', function () {
        return Inertia::render('Dashboard');
    });
    
    Route::get('/test-contract-upload', function () {
        return Inertia::render('Test/ContractDocumentUploadTest');
    });
    
    // Document Creation routes - Web UI routes (Inertia)
    Route::get('/documents', [\App\Http\Controllers\DocumentCreationController::class, 'index'])->name('documents.index');
    Route::get('/documents/{contract_id}', [ReportController::class, 'documentReportByContract'])->name('documents.show');
    
    // Report routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/document', [ReportController::class, 'documentReport'])->name('document');
        Route::get('/monthly', [ReportController::class, 'monthlyReport'])->name('monthly');
        Route::get('/payment-status', [ReportController::class, 'paymentStatusReport'])->name('payment-status');
        Route::get('/yearly', [ReportController::class, 'yearlyReport'])->name('yearly');
        
        // Payment Status Report API endpoints
        Route::post('/payment-status/data', [\App\Http\Controllers\Reports\PaymentStatusReportController::class, 'getPaymentStatusData']);
        Route::post('/payment-status/export', [\App\Http\Controllers\Reports\PaymentStatusReportController::class, 'exportPaymentStatusReport']);
        
        // Yearly Report API endpoints
        Route::post('/yearly/data', [\App\Http\Controllers\Reports\YearlyReportController::class, 'getYearlyData']);
        Route::post('/yearly/export', [\App\Http\Controllers\Reports\YearlyReportController::class, 'exportYearlyReport']);
    });
    
    // Commission Management routes
    Route::prefix('commissions')->name('commissions.')->group(function () {
        Route::get('/', [\App\Http\Controllers\CommissionController::class, 'index'])->name('index');
        Route::get('/pre-purchase', [\App\Http\Controllers\CommissionController::class, 'prePurchase'])->name('pre-purchase');
        Route::get('/post-purchase', [\App\Http\Controllers\CommissionController::class, 'postPurchase'])->name('post-purchase');
        Route::get('/post-purchase/create', [\App\Http\Controllers\CommissionController::class, 'createPostPurchase'])->name('post-purchase.create');
        Route::get('/post-purchase/{commission}/edit', [\App\Http\Controllers\CommissionController::class, 'editPostPurchase'])->name('post-purchase.edit');
        Route::get('/post-purchase/{commission}/steps', [\App\Http\Controllers\CommissionController::class, 'manageSteps'])->name('post-purchase.steps');
        
        // Pre-purchase Commission API routes
        Route::prefix('api/pre-purchase')->group(function () {
            Route::get('/', [\App\Http\Controllers\PrePurchaseCommissionController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\PrePurchaseCommissionController::class, 'store']);
            Route::get('/{commission}', [\App\Http\Controllers\PrePurchaseCommissionController::class, 'show']);
            Route::put('/{commission}', [\App\Http\Controllers\PrePurchaseCommissionController::class, 'update']);
            Route::delete('/{commission}', [\App\Http\Controllers\PrePurchaseCommissionController::class, 'destroy']);
            Route::patch('/{commission}/mark-paid', [\App\Http\Controllers\PrePurchaseCommissionController::class, 'markAsPaid']);
        });
        
        // Post-purchase Commission API routes
        Route::prefix('api/post-purchase')->group(function () {
            Route::get('/', [\App\Http\Controllers\PostPurchaseCommissionController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\PostPurchaseCommissionController::class, 'store']);
            Route::get('/{commission}', [\App\Http\Controllers\PostPurchaseCommissionController::class, 'show']);
            Route::put('/{commission}', [\App\Http\Controllers\PostPurchaseCommissionController::class, 'update']);
            Route::delete('/{commission}', [\App\Http\Controllers\PostPurchaseCommissionController::class, 'destroy']);
            Route::get('/{commission}/payment-steps', [\App\Http\Controllers\PostPurchaseCommissionController::class, 'getPaymentSteps']);
        });
        
        // Payment Step API routes
        Route::prefix('api/payment-steps')->group(function () {
            Route::patch('/{paymentStep}/mark-paid', [\App\Http\Controllers\CommissionPaymentStepController::class, 'markAsPaid']);
            Route::get('/overdue', [\App\Http\Controllers\CommissionPaymentStepController::class, 'getOverdueSteps']);
            Route::get('/upcoming', [\App\Http\Controllers\CommissionPaymentStepController::class, 'getUpcomingSteps']);
            Route::get('/statistics', [\App\Http\Controllers\CommissionPaymentStepController::class, 'getStatistics']);
        });
    });
    
    // Deposit Contracts routes
    Route::prefix('deposit-contracts')->name('deposit-contracts.')->group(function () {
        Route::get('/', [\App\Http\Controllers\DocumentCreationController::class, 'depositContractsIndex'])->name('index');
        Route::get('/create', [\App\Http\Controllers\DocumentCreationController::class, 'createDepositContract'])->name('create');
        Route::get('/select-buyers', [\App\Http\Controllers\DocumentCreationController::class, 'selectBuyers'])->defaults('type', 'deposit_contract')->name('select-buyers');
        Route::get('/{id}/select-sellers', [\App\Http\Controllers\DocumentCreationController::class, 'selectSellers'])->defaults('type', 'deposit_contract')->name('select-sellers');
        Route::get('/{id}/select-lands', [\App\Http\Controllers\DocumentCreationController::class, 'selectLands'])->defaults('type', 'deposit_contract')->name('select-lands');
        Route::get('/{id}/deposit-config', [\App\Http\Controllers\DocumentCreationController::class, 'depositConfig'])->name('deposit-config');
        Route::get('/{id}/success', [\App\Http\Controllers\DocumentCreationController::class, 'success'])->defaults('type', 'deposit_contract')->name('success');
        Route::get('/{id}/download', [\App\Http\Controllers\DocumentCreationController::class, 'download'])->defaults('type', 'deposit_contract')->name('download');
        Route::delete('/{id}', [\App\Http\Controllers\DocumentCreationController::class, 'destroy'])->defaults('type', 'deposit_contract')->name('destroy');
        Route::get('/{id}', [\App\Http\Controllers\DocumentCreationController::class, 'show'])->defaults('type', 'deposit_contract')->name('show');
    });
    
    // Sale Contracts routes
    Route::prefix('sale-contracts')->name('sale-contracts.')->group(function () {
        Route::get('/', [\App\Http\Controllers\DocumentCreationController::class, 'saleContractsIndex'])->name('index');
        Route::get('/create', [\App\Http\Controllers\DocumentCreationController::class, 'createSaleContract'])->name('create');
        Route::get('/select-buyers', [\App\Http\Controllers\DocumentCreationController::class, 'selectBuyers'])->defaults('type', 'sale_contract')->name('select-buyers');
        Route::get('/{id}/select-sellers', [\App\Http\Controllers\DocumentCreationController::class, 'selectSellers'])->defaults('type', 'sale_contract')->name('select-sellers');
        Route::get('/{id}/select-lands', [\App\Http\Controllers\DocumentCreationController::class, 'selectLands'])->defaults('type', 'sale_contract')->name('select-lands');
        Route::get('/{id}/payment-steps', [\App\Http\Controllers\DocumentCreationController::class, 'paymentSteps'])->name('payment-steps');
        Route::get('/{id}/success', [\App\Http\Controllers\DocumentCreationController::class, 'success'])->defaults('type', 'sale_contract')->name('success');
        Route::get('/{id}/download', [\App\Http\Controllers\DocumentCreationController::class, 'download'])->defaults('type', 'sale_contract')->name('download');
        Route::delete('/{id}', [\App\Http\Controllers\DocumentCreationController::class, 'destroy'])->defaults('type', 'sale_contract')->name('destroy');
        Route::get('/{id}', [\App\Http\Controllers\DocumentCreationController::class, 'show'])->defaults('type', 'sale_contract')->name('show');
    });
    
    // Data Entry routes
    Route::prefix('data-entry')->name('data-entry.')->group(function () {
        Route::get('/', [DataEntryController::class, 'index'])->name('index');
        
        // Buyer routes
        Route::prefix('buyers')->name('buyers.')->group(function () {
            Route::get('/', [DataEntryController::class, 'buyersIndex'])->name('index');
            Route::get('/create', [DataEntryController::class, 'buyersCreate'])->name('create');
            Route::get('/{id}/edit', [DataEntryController::class, 'buyersEdit'])->name('edit');
            Route::get('/{id}', [DataEntryController::class, 'buyersShow'])->name('show');
        });
        
        // Seller routes
        Route::prefix('sellers')->name('sellers.')->group(function () {
            Route::get('/', [DataEntryController::class, 'sellersIndex'])->name('index');
            Route::get('/create', [DataEntryController::class, 'sellersCreate'])->name('create');
            Route::get('/{id}/edit', [DataEntryController::class, 'sellersEdit'])->name('edit');
            Route::get('/{id}', [DataEntryController::class, 'sellersShow'])->name('show');
        });
        
        // Land routes
        Route::prefix('lands')->name('lands.')->group(function () {
            Route::get('/', [DataEntryController::class, 'landsIndex'])->name('index');
            Route::get('/create', [DataEntryController::class, 'landsCreate'])->name('create');
            Route::get('/{id}/edit', [DataEntryController::class, 'landsEdit'])->name('edit');
            Route::get('/{id}', [DataEntryController::class, 'landsShow'])->name('show');
        });
    });
    
    // Administrator-only routes
    Route::middleware('role:administrator')->group(function () {
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
    
    // API Routes
    Route::prefix('api')->middleware(['auth', 'verified'])->group(function () {
        // User management endpoints
        Route::prefix('users')->group(function () {
            Route::get('/', [UserApiController::class, 'index']);
            Route::get('/{id}', [UserApiController::class, 'show']);
            Route::post('/', [UserApiController::class, 'store']);
            Route::put('/{id}', [UserApiController::class, 'update']);
            Route::delete('/{id}', [UserApiController::class, 'destroy']);
            Route::post('/{id}/toggle-status', [UserApiController::class, 'toggleStatus']);
        });
        
        // File Upload endpoints
        Route::prefix('files')->group(function () {
            Route::post('/upload-temp', [FileUploadController::class, 'uploadTemp']);
            Route::delete('/delete-temp', [FileUploadController::class, 'deleteTemp']);
        });
        
        // Reports API endpoints
        Route::prefix('reports')->group(function () {
            // Document Report
            Route::prefix('document')->group(function () {
                Route::post('/search', [\App\Http\Controllers\Reports\DocumentReportController::class, 'search']);
                Route::get('/export/{contractId}', [\App\Http\Controllers\Reports\DocumentReportController::class, 'export']);
            });
            
            // Monthly Report
            Route::prefix('monthly')->group(function () {
                Route::post('/data', [\App\Http\Controllers\Reports\MonthlyReportController::class, 'getMonthlyData']);
                Route::post('/export', [\App\Http\Controllers\Reports\MonthlyReportController::class, 'exportMonthlyReport']);
            });
            
            // Payment Steps
            Route::prefix('payment-steps')->group(function () {
                Route::get('/{paymentStepId}', [\App\Http\Controllers\Reports\PaymentStepController::class, 'show']);
                Route::put('/{paymentStepId}', [\App\Http\Controllers\Reports\PaymentStepController::class, 'update']);
                Route::post('/{stepId}/create-contract', [\App\Http\Controllers\Reports\PaymentStepController::class, 'createContract']);
                Route::get('/{stepId}/documents', [\App\Http\Controllers\Reports\PaymentStepController::class, 'getDocuments']);
                Route::post('/{stepId}/mark-as-paid', [\App\Http\Controllers\Reports\PaymentStepController::class, 'markAsPaid']);
            });
            
            // Contract Documents
            Route::prefix('contract-documents')->group(function () {
                Route::post('/{contractId}/upload', [\App\Http\Controllers\Reports\ContractDocumentController::class, 'upload']);
                Route::get('/{documentId}/download', [\App\Http\Controllers\Reports\ContractDocumentController::class, 'download']);
                Route::delete('/{documentId}', [\App\Http\Controllers\Reports\ContractDocumentController::class, 'delete']);
            });
        });
        
        // Data Entry - Buyer endpoints
        Route::prefix('buyers')->group(function () {
            Route::get('/', [BuyerApiController::class, 'index']);
            Route::post('/', [BuyerApiController::class, 'store']);
            Route::get('/{id}', [BuyerApiController::class, 'show']);
            Route::put('/{id}', [BuyerApiController::class, 'update']);
            Route::delete('/{id}', [BuyerApiController::class, 'destroy']);
            Route::put('/{id}/documents/{documentId}/set-display', [BuyerApiController::class, 'setDisplayDocument']);
        });
        
        // Data Entry - Seller endpoints
        Route::prefix('sellers')->group(function () {
            Route::get('/', [SellerApiController::class, 'index']);
            Route::post('/', [SellerApiController::class, 'store']);
            Route::get('/{id}', [SellerApiController::class, 'show']);
            Route::put('/{id}', [SellerApiController::class, 'update']);
            Route::delete('/{id}', [SellerApiController::class, 'destroy']);
            Route::put('/{id}/documents/{documentId}/set-display', [SellerApiController::class, 'setDisplayDocument']);
        });
        
        // Data Entry - Land endpoints
        Route::prefix('lands')->group(function () {
            Route::get('/', [LandApiController::class, 'index']);
            Route::post('/', [LandApiController::class, 'store']);
            Route::get('/{id}', [LandApiController::class, 'show']);
            Route::put('/{id}', [LandApiController::class, 'update']);
            Route::delete('/{id}', [LandApiController::class, 'destroy']);
            Route::put('/{id}/documents/{documentId}/set-display', [LandApiController::class, 'setDisplayDocument']);
        });
        
        // Common Document API endpoints
        Route::get('/documents', [DocumentCreationController::class, 'index']);
        
        // Deposit Contract API endpoints
        Route::prefix('deposit-contracts')->group(function () {
            Route::post('/create', [DocumentCreationController::class, 'apiCreateDepositContract']);
            Route::get('/{id}', [DocumentCreationController::class, 'show']);
            Route::post('/{id}/select-buyers', [DocumentCreationController::class, 'selectBuyers']);
            Route::post('/{id}/select-sellers', [DocumentCreationController::class, 'selectSellers']);
            Route::post('/{id}/select-lands', [DocumentCreationController::class, 'selectLands']);
            Route::post('/{id}/deposit-config', [DocumentCreationController::class, 'depositConfig']);
            Route::post('/{id}/generate', [DocumentCreationController::class, 'generate']);
        });
        
        // Sale Contract API endpoints
        Route::prefix('sale-contracts')->group(function () {
            Route::post('/create', [DocumentCreationController::class, 'apiCreateSaleContract']);
            Route::get('/{id}', [DocumentCreationController::class, 'show']);
            Route::post('/{id}/select-buyers', [DocumentCreationController::class, 'selectBuyers']);
            Route::post('/{id}/select-sellers', [DocumentCreationController::class, 'selectSellers']);
            Route::post('/{id}/select-lands', [DocumentCreationController::class, 'selectLands']);
            Route::post('/{id}/payment-steps', [DocumentCreationController::class, 'paymentSteps']);
            Route::post('/{id}/generate', [DocumentCreationController::class, 'generate']);
        });
    });
});

require __DIR__.'/auth.php';
