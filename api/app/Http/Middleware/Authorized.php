<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\BearerToken;
use App\Models\User;

class Authorized
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
        $token = BearerToken::firstWhere('token',$request->bearerToken());
        $badResponse = response()->json([
            'message' => 'no or invalid token'
        ],401);
        if($token === null) return $badResponse;
        $user = $token->user;
        if($user === null) return $badResponse;
        $request->user = $user;
        return $next($request);
    }
}
