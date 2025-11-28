<?php

namespace App\Services\Customer;

use Illuminate\Http\Request;

interface CustomerServiceInterface
{
    public function dashboard();
    public function createJobPost(Request $request);
    public function searchWorker(Request $request);
}
