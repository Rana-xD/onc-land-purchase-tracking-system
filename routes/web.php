<?php

use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\DashboardController;
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
    
    // Administrator-only routes
    Route::middleware('role:administrator')->group(function () {
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
    
    // User Management API Routes
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
    });
});

require __DIR__.'/auth.php';
