<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider; // Correção aqui
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider // Herda da classe correta
{
    protected $namespace = 'App\Http\Controllers'; // Define o namespace

    public function boot(): void
    {
        $this->configureRateLimiting();

        // Carrega as rotas
        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));
        });

        parent::boot(); // Chama o boot() da classe pai
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
