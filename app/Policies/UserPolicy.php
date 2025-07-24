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
        return $user->hasPermission('users.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->hasPermission('users.view') || $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('users.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Check if user has permission to edit users
        if ($user->hasPermission('users.edit')) {
            return true;
        }
        
        // Users can update their own profile
        return $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Check if user has permission to delete users
        return $user->hasPermission('users.delete');
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
        
        // Check if user has permission to toggle user status
        return $user->hasPermission('users.toggle_status');
    }
}
