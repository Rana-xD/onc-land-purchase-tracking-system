<?php

use App\Http\Controllers\Api\BuyerApiController;
use App\Http\Controllers\Api\BuyerController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\LandApiController;
use App\Http\Controllers\Api\LandController;
use App\Http\Controllers\Api\SellerApiController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataEntryController;
use App\Http\Controllers\ProfileController;
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
    
    // Simple test route to isolate the issue
    Route::get('/test-page', function () {
        return Inertia::render('Dashboard');
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
    });
});

require __DIR__.'/auth.php';
