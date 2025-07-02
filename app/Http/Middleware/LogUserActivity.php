<?php

namespace App\Http\Middleware;

use App\Services\UserActivityService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Process the request
        $response = $next($request);
        
        // Log user activity for specific actions
        if (auth()->check()) {
            $this->logActivity($request);
        }
        
        return $response;
    }
    
    /**
     * Log user activity based on the request.
     */
    private function logActivity(Request $request): void
    {
        $route = $request->route();
        if (!$route) return;
        
        $routeName = $route->getName();
        if (!$routeName) return;
        
        $user = auth()->user();
        
        // Log based on route name
        switch ($routeName) {
            case 'login':
                UserActivityService::log(
                    'ចូលប្រើប្រាស់', // Login
                    'បានចូលប្រើប្រាស់ប្រព័ន្ធ' // Logged into the system
                );
                break;
                
            case 'logout':
                UserActivityService::log(
                    'ចាកចេញ', // Logout
                    'បានចាកចេញពីប្រព័ន្ធ' // Logged out of the system
                );
                break;
                
            case (str_contains($routeName, 'profile')):
                if ($request->isMethod('patch')) {
                    UserActivityService::log(
                        'កែប្រែព័ត៌មានផ្ទាល់ខ្លួន', // Edit profile
                        'បានកែប្រែព័ត៌មានផ្ទាល់ខ្លួន' // Updated personal information
                    );
                }
                break;
                
            // Add more cases for other important actions
        }
    }
}
