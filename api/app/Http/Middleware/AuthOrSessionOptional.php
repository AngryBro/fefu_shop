<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\BearerToken;
use App\Models\Session;

class AuthOrSessionOptional
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
            $bearerToken = BearerToken::firstWhere('token',$request->bearerToken());
            if($bearerToken!==null) {
                $request->xsession = null;
                $request->user = $bearerToken->user;
                return $next($request);
            }
            else {
                return $badResponse;
            }
        }
        if($request->hasHeader('X-Session')) {
            $session = Session::firstWhere('token',$request->header('X-Session'));
            if($session !== null) {
                $request->user = null;
                $request->xsession = $session;
                return $next($request);
            }
            else {
                return $badResponse;
            }
        }
        $request->user = null;
        $request->xsession = null;
        return $next($request);
    }
}
