<?php
// WorkerConnect API Routes
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\WorkerController;

// Authentication routes
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/logout',  'logout')->middleware('multi-auth');
    Route::post('/refresh', 'refresh')->middleware('multi-auth');
});

// Customer routes
Route::controller(CustomerController::class)->prefix('customer')->group(function ()
{
    Route::get('dashboard','dashboard')->middleware('auth:customer');
    Route::post('create-job','CreateJobPost')->middleware('auth:customer');
    Route::post('search-worker','SearchWorker')->middleware('auth:customer');

});

// Worker routes
Route::controller(WorkerController::class)->prefix('worker')->group(function ()
{
    Route::get('dashboard','dashboard')->middleware('auth:worker');
    Route::get('show-jobs','showJobs')->middleware('auth:worker');
    Route::post('accept-job/{id}','AcceptJob')->middleware('auth:worker');
    Route::post('reject-job/{id}','RejectJob')->middleware('auth:worker');
    Route::post('complete-job/{id}','CompleteJob')->middleware('auth:worker');
});



