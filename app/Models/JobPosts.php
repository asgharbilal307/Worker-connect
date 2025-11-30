<?php

/**
 * JobPosts Model
 * Represents job postings in the system
 */
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class JobPosts extends Model
{
    use HasFactory;

    protected $table = 'job_posts';
    
    /**
     * Get all active job posts
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function activeJobs()
    {
        return self::where('status', '!=', 'completed')->latest();
    }

    /**
     * Check if job is still accepting bids
     * @return bool
     */
    public function isAcceptingBids()
    {
        return $this->status === 'open' || $this->status === 'pending';
    }

    /**
     * Get job cost range for display
     * @return string
     */
    public function getCostDisplay()
    {
        return "Rs. {$this->budget}";
    }
}
