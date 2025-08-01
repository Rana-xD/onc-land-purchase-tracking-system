<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }
        
        $user = $request->user();
        
        // Check if user is active
        if (!$user->is_active) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Account inactive'], 403);
            }
            return redirect()->route('login')->with('error', 'គណនីរបស់អ្នកត្រូវបានបិទ។'); // Your account has been deactivated
        }
        
        // Check if user has one of the required roles using new role system
        $hasAccess = false;
        
        foreach ($roles as $role) {
            // Support comma-separated roles in route definition
            $allowedRoles = explode(',', $role);
            
            foreach ($allowedRoles as $allowedRole) {
                $allowedRole = trim($allowedRole);
                
                // Check if user has the required role using new role system
                if ($user->assignedRole && $user->assignedRole->name === $allowedRole) {
                    $hasAccess = true;
                    break 2; // Break out of both loops
                }
            }
        }
        
        if (!$hasAccess) {
            // For API requests, return JSON response
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            // For web requests, redirect with error message
            return redirect()->route('dashboard')->with('error', 'អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់ទំព័រនេះទេ។'); // You don't have permission to access this page
        }

        return $next($request);
    }
}
