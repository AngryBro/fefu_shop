<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Session;

class SessionRequired
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $sessionToken = $request->header('X-Session');
        $session = Session::firstWhere('token',$sessionToken);
        if($session === null) {
            return response()->json([
                'X-Session header required'
            ],401);
        }
        $request->xsession = $session;
        return $next($request);
    }
}
