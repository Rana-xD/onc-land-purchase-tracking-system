<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);
        
        $users = User::all();
        
        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|in:administrator,manager,staff',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('users.index')
            ->with('message', 'អ្នកប្រើប្រាស់ត្រូវបានបង្កើតដោយជោគជ័យ'); // User created successfully
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        
        return Inertia::render('Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        return Inertia::render('Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:administrator,manager,staff',
        ]);

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('message', 'អ្នកប្រើប្រាស់ត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ'); // User updated successfully
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        
        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            return back()->with('error', 'អ្នកមិនអាចលុបគណនីខ្លួនឯងបានទេ'); // You cannot delete your own account
        }

        $userName = $user->name;
        
        // Use archive service to properly track deletion
        $archiveService = app(\App\Services\ArchiveService::class);
        $archiveService->archive('users', $user->id);

        return redirect()->route('users.index')
            ->with('message', 'អ្នកប្រើប្រាស់ត្រូវបានលុបដោយជោគជ័យ'); // User deleted successfully
    }
    
    /**
     * Display the user management interface.
     */
    public function management()
    {
        $this->authorize('viewAny', User::class);
        
        return Inertia::render('Users/UserManagement');
    }
}
