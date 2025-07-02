<?php

namespace App\Services;

use App\Models\UserActivity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class UserActivityService
{
    /**
     * Log user activity.
     *
     * @param string $action
     * @param string $description
     * @return void
     */
    public static function log(string $action, string $description): void
    {
        if (Auth::check()) {
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'description' => $description,
                'ip_address' => Request::ip(),
            ]);
        }
    }
}
