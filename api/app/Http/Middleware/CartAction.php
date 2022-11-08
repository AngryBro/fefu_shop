<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CartAction
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
        $user = $request->user;
        $session = $request->xsession;
        if($session !== null) {
            $cart = $session->cart;
        }
        elseif($user !== null) {
            $cart = $user->cart;
        }
        else {
            $cart = null;
        }
        $request->cart = $cart;
        return $next($request);
    }
}
