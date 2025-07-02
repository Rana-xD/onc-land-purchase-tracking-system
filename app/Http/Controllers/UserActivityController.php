<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserActivityController extends Controller
{
    /**
     * Display a listing of user activities.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', UserActivity::class);
        
        $activities = UserActivity::with('user')
            ->when($request->input('user_id'), function($query, $userId) {
                return $query->where('user_id', $userId);
            })
            ->when($request->input('action'), function($query, $action) {
                return $query->where('action', 'like', "%{$action}%");
            })
            ->when($request->input('date_from'), function($query, $dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->input('date_to'), function($query, $dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();
            
        $users = User::select('id', 'name')->orderBy('name')->get();
        
        return Inertia::render('Activities/Index', [
            'activities' => $activities,
            'users' => $users,
            'filters' => $request->only(['user_id', 'action', 'date_from', 'date_to']),
        ]);
    }
    
    /**
     * Display activities for the current user.
     */
    public function myActivities()
    {
        $activities = UserActivity::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return Inertia::render('Activities/MyActivities', [
            'activities' => $activities,
        ]);
    }
}
