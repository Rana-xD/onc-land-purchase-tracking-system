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
        // Only administrators can list users
        if (Auth::user()->role !== 'administrator') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::query();

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
                $query->where('role', $role);
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
        // Only administrators can view user details
        if (Auth::user()->role !== 'administrator') {
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
        // Only administrators can create users
        if (Auth::user()->role !== 'administrator') {
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
            'role' => 'required|in:administrator,manager,staff',
            'is_active' => 'boolean',
        ]);

        // Convert username to lowercase
        $validated['username'] = strtolower($validated['username']);
        
        // Hash the password
        $validated['password'] = Hash::make($validated['password']);

        // Create the user
        $user = User::create($validated);

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
        // Only administrators can update users
        if (Auth::user()->role !== 'administrator') {
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
            'role' => 'required|in:administrator,manager,staff',
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
        if ($user->id === $currentUser->id && $user->role !== $validated['role']) {
            return response()->json([
                'message' => 'អ្នកមិនអាចផ្លាស់ប្តូរតួនាទីរបស់ខ្លួនឯងបានទេ' // You cannot change your own role
            ], 403);
        }

        // Check if this is the last administrator
        if ($user->role === 'administrator' && $validated['role'] !== 'administrator') {
            $adminCount = User::where('role', 'administrator')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'មិនអាចផ្លាស់ប្តូរតួនាទីរបស់អ្នកគ្រប់គ្រងចុងក្រោយបានទេ' // Cannot change the role of the last administrator
                ], 403);
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
        // Only administrators can delete users
        if (Auth::user()->role !== 'administrator') {
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
        if ($user->role === 'administrator') {
            $adminCount = User::where('role', 'administrator')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'មិនអាចលុបអ្នកគ្រប់គ្រងចុងក្រោយបានទេ' // Cannot delete the last administrator
                ], 403);
            }
        }

        $userName = $user->name;
        
        // Soft delete the user
        $user->delete();

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
        // Only administrators can toggle user status
        if (Auth::user()->role !== 'administrator') {
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
        if ($user->role === 'administrator' && $user->is_active) {
            $activeAdminCount = User::where('role', 'administrator')
                                    ->where('is_active', true)
                                    ->count();
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
