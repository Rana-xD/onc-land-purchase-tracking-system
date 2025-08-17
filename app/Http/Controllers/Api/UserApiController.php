<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserApiController extends Controller
{
    /**
     * Display a paginated listing of users with search and filters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Check if user has permission to view users
        if (!Auth::user()->hasPermission('users.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::with('assignedRole');

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        // Apply role filter
        if ($role = $request->input('role')) {
            if ($role !== 'all') {
                $query->whereHas('assignedRole', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            }
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Get paginated results
        $users = $query->orderBy('name')->paginate(10);

        return response()->json($users);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Check if user has permission to view users
        if (!Auth::user()->hasPermission('users.view')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Check if user has permission to create users
        if (!Auth::user()->hasPermission('users.create')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'min:3',
                'max:50',
                'unique:users,username',
            ],
            'password' => 'required|string|min:6|confirmed',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
        ]);

        // Convert username to lowercase
        $validated['username'] = strtolower($validated['username']);
        
        // Hash the password
        $validated['password'] = Hash::make($validated['password']);

        // Create the user
        $user = User::create($validated);
        
        // Load the assigned role for response
        $user->load('assignedRole');

        return response()->json([
            'message' => 'បានបន្ថែមអ្នកប្រើប្រាស់ដោយជោគជ័យ', // User added successfully
            'user' => $user
        ], 201);
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Check if user has permission to edit users
        if (!Auth::user()->hasPermission('users.edit')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        $currentUser = Auth::user();

        // Validate the request
        $rules = [
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'min:3',
                'max:50',
                Rule::unique('users')->ignore($user->id),
            ],
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
        ];

        // Password is optional on update
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:6|confirmed';
        }

        $validated = $request->validate($rules);

        // Convert username to lowercase
        $validated['username'] = strtolower($validated['username']);

        // Prevent changing own role
        if ($user->id === $currentUser->id && $user->role_id !== $validated['role_id']) {
            return response()->json([
                'message' => 'អ្នកមិនអាចផ្លាស់ប្តូរតួនាទីរបស់ខ្លួនឯងបានទេ' // You cannot change your own role
            ], 403);
        }

        // Check if this is the last administrator
        if ($user->hasRole('administrator')) {
            $newRole = \App\Models\Role::find($validated['role_id']);
            if ($newRole->name !== 'administrator') {
                $adminCount = User::whereHas('assignedRole', function ($q) {
                    $q->where('name', 'administrator');
                })->count();
                if ($adminCount <= 1) {
                    return response()->json([
                        'message' => 'មិនអាចផ្លាស់ប្តូរតួនាទីរបស់អ្នកគ្រប់គ្រងចុងក្រោយបានទេ' // Cannot change the role of the last administrator
                    ], 403);
                }
            }
        }

        // Hash the password if provided
        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Update the user
        $user->update($validated);
        
        // Load the assigned role for response
        $user->load('assignedRole');

        return response()->json([
            'message' => 'បានកែប្រែអ្នកប្រើប្រាស់ដោយជោគជ័យ', // User updated successfully
            'user' => $user
        ]);
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Check if user has permission to delete users
        if (!Auth::user()->hasPermission('users.delete')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        $currentUser = Auth::user();

        // Prevent self-deletion
        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'អ្នកមិនអាចលុបគណនីខ្លួនឯងបានទេ' // You cannot delete your own account
            ], 403);
        }

        // Check if this is the last administrator
        if ($user->hasRole('administrator')) {
            $adminCount = User::whereHas('assignedRole', function ($q) {
                $q->where('name', 'administrator');
            })->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'មិនអាចលុបអ្នកគ្រប់គ្រងចុងក្រោយបានទេ' // Cannot delete the last administrator
                ], 403);
            }
        }

        $userName = $user->name;
        
        // Use archive service to properly track deletion
        $archiveService = app(\App\Services\ArchiveService::class);
        $archiveService->archive('users', $user->id);

        return response()->json([
            'message' => 'បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ' // User deleted successfully
        ]);
    }

    /**
     * Toggle the active status of a user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus($id)
    {
        // Check if user has permission to toggle user status
        if (!Auth::user()->hasPermission('users.toggle_status')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        $currentUser = Auth::user();

        // Prevent toggling own status
        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'អ្នកមិនអាចផ្លាស់ប្តូរស្ថានភាពគណនីខ្លួនឯងបានទេ' // You cannot change your own account status
            ], 403);
        }

        // Check if this is the last administrator and we're trying to deactivate
        if ($user->hasRole('administrator') && $user->is_active) {
            $activeAdminCount = User::whereHas('assignedRole', function ($q) {
                $q->where('name', 'administrator');
            })->where('is_active', true)->count();
            if ($activeAdminCount <= 1) {
                return response()->json([
                    'message' => 'មិនអាចបិទអ្នកគ្រប់គ្រងចុងក្រោយបានទេ' // Cannot deactivate the last administrator
                ], 403);
            }
        }

        // Toggle the status
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ', // Status changed successfully
            'user' => $user
        ]);
    }
}
