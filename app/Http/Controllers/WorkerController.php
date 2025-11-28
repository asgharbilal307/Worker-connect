<?php

namespace App\Http\Controllers;

use App\Services\Worker\WorkerServiceInterface;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    protected $workerService;

    public function __construct(WorkerServiceInterface $workerService)
    {
        $this->workerService = $workerService;
    }

    public function dashboard()
    {
        $data = $this->workerService->dashboard();

        return response()->json([
            'success' => true,
            'message' => 'Welcome to worker dashboard',
            'Worker Details' => $data['worker'],
            'Completed jobs' => $data['completed'],
            'Accepted jobs' => $data['accepted'],
        ]);
    }

    public function showJobs()
    {
        $jobs = $this->workerService->showJobs();

        if ($jobs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Jobs not found',
            ]);
        }

        return response()->json([
            'success' => true,
            'Available Jobs' => $jobs,
        ]);
    }

    public function AcceptJob($id)
    {
        $result = $this->workerService->acceptJob($id);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Job post not found',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Job has been accepted',
            'Job details' => $result['job'],
            'Customer Details' => $result['customer']
        ]);
    }

    public function CompleteJob($id)
    {
        $job = $this->workerService->completeJob($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job post not found'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Job has been completed',
            'Job details' => $job
        ]);
    }

    public function RejectJob($id)
    {
        $job = $this->workerService->rejectJob($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job post not found'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Job has been rejected',
            'Job details' => $job
        ]);
    }
}
