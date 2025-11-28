<?php


namespace App\Services\Worker;

interface WorkerServiceInterface
{
    public function dashboard();

    public function showJobs();

    public function acceptJob($id);

    public function completeJob($id);

    public function rejectJob($id);
}
