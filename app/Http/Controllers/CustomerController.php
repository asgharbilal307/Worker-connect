<?php

namespace App\Http\Controllers;

use App\Services\Customer\CustomerServiceInterface;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(CustomerServiceInterface $customerService)
    {
        $this->customerService = $customerService;
    }

    public function dashboard()
    {
        return response()->json($this->customerService->dashboard());
    }

    public function CreateJobPost(Request $request)
    {
        $request->validate([
            'worker_type'=>'required|in:electrician,plumber,painter,carpenter,mechanic',
            'job_description'=>'required|string|min:5|max:100',
            'job_location'=>'required|string|min:5|max:100',
            'budget'=>'required|integer|min:0',
        ]);

        return response()->json(
            $this->customerService->createJobPost($request)
        );
    }

    public function SearchWorker(Request $request)
    {
        $request->validate([
            'skill_category' => 'required|in:electrician,plumber,painter,carpenter,mechanic',
            'experience' => 'required|integer|min:0',
            'city' => 'required|string|max:100|min:3',
        ]);

        return response()->json(
            $this->customerService->searchWorker($request)
        );
    }
}
