<?php

namespace App\Providers;
use App\Services\Customer\CustomerServiceInterface;
use App\Services\Customer\CustomerService;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind(CustomerServiceInterface::class, CustomerService::class);
        $this->app->bind(
            \App\Services\Worker\WorkerServiceInterface::class,
            \App\Services\Worker\WorkerService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
