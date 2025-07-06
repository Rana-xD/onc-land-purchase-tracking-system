<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserActivityController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirect root to dashboard if authenticated, otherwise to login page
Route::get('/', function () {
    return auth()->check() ? redirect('/dashboard') : Inertia::render('Auth/Login');
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
    
    // User activity routes for all users
    Route::get('/my-activities', [UserActivityController::class, 'myActivities'])->name('activities.my');
    
    // User routes with role-based access control
    Route::middleware('role:administrator,manager')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        
        // User activity logs - accessible to administrators and managers
        Route::get('/activities', [UserActivityController::class, 'index'])->name('activities.index');
    });
    
    // Administrator-only routes
    Route::middleware('role:administrator')->group(function () {
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/auth.php';
