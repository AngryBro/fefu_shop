<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\BearerToken;
use App\Models\User;
use App\Models\Session;

class AuthOrSessionRequired
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
        $badResponse = response()->json([
            'message' => 'invalid token'
        ],401);
        if($request->hasHeader('Authorization')) {
            $bearerToken = BearerToken::firstWhere('token', $request->bearerToken());
            if($bearerToken === null) return $badResponse;
            else {
                $request->user = $bearerToken->user;
                $request->xsession = null;
                return $next($request);
            }
        }
        if($request->hasHeader('X-Session')) {
            $session = Session::firstWhere('token', $request->header('X-Session'));
            if($session === null) return $badResponse;
            else {
                $request->user = null;
                $request->xsession = $session;
                return $next($request);
            }
        }
        return $badResponse;
    }
}
