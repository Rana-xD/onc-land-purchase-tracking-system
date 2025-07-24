<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleApiController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $query = Role::with(['permissions', 'users'])
            ->withCount('users');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('display_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== null) {
            $query->where('is_active', $request->status);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $roles = $query->paginate($perPage);

        return response()->json($roles);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $role = Role::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
            'is_active' => true
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        $role->load(['permissions', 'users']);
        $role->loadCount('users');

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully.',
            'data' => $role
        ], 201);
    }

    /**
     * Display the specified role.
     */
    public function show($id)
    {
        $role = Role::with(['permissions', 'users'])
            ->withCount('users')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $role->update([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
            'is_active' => $request->is_active ?? $role->is_active
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        $role->load(['permissions', 'users']);
        $role->loadCount('users');

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully.',
            'data' => $role
        ]);
    }

    /**
     * Remove the specified role.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        // Check if role has users assigned
        if ($role->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete role that has users assigned to it.'
            ], 400);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully.'
        ]);
    }

    /**
     * Toggle role status.
     */
    public function toggleStatus($id)
    {
        $role = Role::findOrFail($id);
        
        $role->update([
            'is_active' => !$role->is_active
        ]);

        $status = $role->is_active ? 'activated' : 'deactivated';
        
        return response()->json([
            'success' => true,
            'message' => "Role {$status} successfully.",
            'data' => $role
        ]);
    }

    /**
     * Get all permissions grouped by module.
     */
    public function getPermissions()
    {
        $permissions = Permission::getByModule();
        
        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    /**
     * Get roles for dropdown/select options.
     */
    public function getForSelect()
    {
        $roles = Role::where('is_active', true)
            ->select('id', 'name', 'display_name')
            ->orderBy('display_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
}
