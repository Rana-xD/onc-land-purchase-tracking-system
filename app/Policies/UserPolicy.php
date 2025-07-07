<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'administrator' || $user->role === 'manager';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->role === 'administrator' || $user->role === 'manager' || $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'administrator';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Admin can update any user
        if ($user->role === 'administrator') {
            return true;
        }
        
        // Manager can update staff but not other managers or admins
        if ($user->role === 'manager') {
            return $model->role === 'staff';
        }
        
        // Users can update their own profile
        return $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Admin can delete any user except themselves (handled in controller)
        if ($user->role === 'administrator') {
            return true;
        }
        
        // Manager can delete staff but not other managers or admins
        if ($user->role === 'manager') {
            return $model->role === 'staff';
        }
        
        return false;
    }
    
    /**
     * Determine whether the user can toggle the active status of the model.
     */
    public function toggleStatus(User $user, User $model): bool
    {
        // Prevent users from deactivating themselves
        if ($user->id === $model->id) {
            return false;
        }
        
        // Admin can toggle status for any user except themselves
        if ($user->role === 'administrator') {
            return true;
        }
        
        // Manager can toggle status for staff only
        if ($user->role === 'manager') {
            return $model->role === 'staff';
        }
        
        return false;
    }
}
