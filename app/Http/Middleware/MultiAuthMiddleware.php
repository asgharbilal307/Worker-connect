<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MultiAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Try both guards
        if (Auth::guard('customer')->check()) {
            Auth::shouldUse('customer');
        } elseif (Auth::guard('worker')->check()) {
            Auth::shouldUse('worker');
        } else {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return $next($request);
    }
}
