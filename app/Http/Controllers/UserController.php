<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserActivity;
use App\Services\UserActivityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
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

        UserActivityService::log(
            'បង្កើតអ្នកប្រើប្រាស់', // Created user
            'បានបង្កើតអ្នកប្រើប្រាស់ថ្មី: ' . $user->name // Created new user: [name]
        );

        return redirect()->route('users.index')
            ->with('message', 'អ្នកប្រើប្រាស់ត្រូវបានបង្កើតដោយជោគជ័យ'); // User created successfully
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        
        $activities = $user->activities()->latest()->take(10)->get();
        
        return Inertia::render('Users/Show', [
            'user' => $user,
            'activities' => $activities
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

        UserActivityService::log(
            'កែប្រែអ្នកប្រើប្រាស់', // Updated user
            'បានកែប្រែព័ត៌មានអ្នកប្រើប្រាស់: ' . $user->name // Updated user information: [name]
        );

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
        if ($user->id === auth()->id()) {
            return back()->with('error', 'អ្នកមិនអាចលុបគណនីខ្លួនឯងបានទេ'); // You cannot delete your own account
        }

        $userName = $user->name;
        
        $user->delete();

        UserActivityService::log(
            'លុបអ្នកប្រើប្រាស់', // Deleted user
            'បានលុបអ្នកប្រើប្រាស់: ' . $userName // Deleted user: [name]
        );

        return redirect()->route('users.index')
            ->with('message', 'អ្នកប្រើប្រាស់ត្រូវបានលុបដោយជោគជ័យ'); // User deleted successfully
    }
}
