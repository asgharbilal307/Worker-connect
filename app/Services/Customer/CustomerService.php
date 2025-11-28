<?php

namespace App\Services\Customer;

use App\Models\Customer;
use App\Models\JobPosts;
use App\Models\Skills_Category;
use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerService implements CustomerServiceInterface
{
    public function dashboard()
    {
        $id = Auth::id();

        $customer = Customer::find($id);
        $Completedjobs = JobPosts::where('customer_id', $id)->where('status','completed')->get();
        $Activejobs = JobPosts::where('customer_id', $id)->where('status','active')->get();
        $Pendingjobs = JobPosts::where('customer_id', $id)->where('status','inactive')->get();
        $Acceptedjobs = JobPosts::where('customer_id', $id)->where('status','in_process')->get();
        $totaljobs=count($Completedjobs)+count($Activejobs)+count($Pendingjobs)+count($Acceptedjobs);
        return [
            'success' => true,
            'message' => 'Customer dashboard',
            'Customer Details' => $customer,
            'Total Jobs' => $totaljobs,
            'Completed Jobs' => $Completedjobs->isEmpty() ? null : $Completedjobs,
            'Active Jobs' => $Activejobs->isEmpty() ? null : $Activejobs,
            'Pending Jobs' => $Pendingjobs->isEmpty() ? null : $Pendingjobs,
            'Accepted Jobs' => $Acceptedjobs->isEmpty() ? null : $Acceptedjobs,

        ];
    }

    public function createJobPost(Request $request)
    {
        $skill_id = Skills_Category::where('name', $request->worker_type)->value('id');

        $job = new JobPosts();
        $job->customer_id = Auth::id();
        $job->job_description = $request->job_description;
        $job->job_location = $request->job_location;
        $job->budget = $request->budget;
        $job->skills_id = $skill_id;

        if ($job->save()) {
            return [
                'success' => true,
                'message' => 'Job posted successfully',
                'data' => $job,
            ];
        }

        return [
            'success' => false,
            'message' => 'Job posted unsuccessfully',
        ];
    }

    public function searchWorker(Request $request)
    {
        $skillId = Skills_Category::where('name', $request->skill_category)->value('id');

        $workers = Worker::where('skills_id', $skillId)
            ->where('experience', '>=', $request->experience)
            ->where('city', $request->city)
            ->get();

        if ($workers->isEmpty()) {
            return [
                'success' => false,
                'message' => 'There is no workers found',
            ];
        }

        return [
            'success' => true,
            'message' => 'Workers found',
            'data' => $workers,
        ];
    }
}
