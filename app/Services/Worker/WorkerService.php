<?php


namespace App\Services\Worker;

use App\Models\Customer;
use App\Models\JobPosts;
use App\Models\Worker;
use Illuminate\Support\Facades\Auth;

class WorkerService implements WorkerServiceInterface
{
    public function dashboard()
    {
        $id = Auth::id();
        $worker = Worker::find($id);

        return [
            'worker' => $worker,
            'completed' => JobPosts::where('assigned_to', $id)->where('status', 'completed')->count(),
            'accepted' => JobPosts::where('assigned_to', $id)->where('status', 'in_process')->count()
        ];
    }

    public function showJobs()
    {
        $id = Auth::id();
        $worker = Worker::find($id);

        return JobPosts::where('skills_id', $worker->skills_id)
            ->where('status', 'active')
            ->whereJsonDoesntContain('rejected_by', $id)
            ->get();
    }

    public function acceptJob($id)
    {
        $job = JobPosts::where('id', $id)->where('status', 'active')->first();

        if (!$job) return false;

        $job->status = 'in_process';
        $job->assigned_to = Auth::id();
        $job->save();

        return [
            'job' => $job,
            'customer' => Customer::find($job->customer_id)
        ];
    }

    public function completeJob($id)
    {
        $job = JobPosts::where('id', $id)
            ->where('status', 'in_process')
            ->where('assigned_to', Auth::id())
            ->first();

        if (!$job) return false;

        $job->status = 'completed';
        $job->save();

        return $job;
    }

    public function rejectJob($id)
    {
        $job = JobPosts::where('id', $id)->where('status', 'active')->first();

        if (!$job) return false;

        $job->rejected_by = json_encode([Auth::id()]);
        $job->save();

        return $job;
    }
}
