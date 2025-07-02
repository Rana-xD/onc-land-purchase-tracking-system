<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserActivityPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isManager();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserActivity $activity): bool
    {
        // Admin and managers can view any activity
        if ($user->isAdmin() || $user->isManager()) {
            return true;
        }
        
        // Users can only view their own activities
        return $user->id === $activity->user_id;
    }
}
