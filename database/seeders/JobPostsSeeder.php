<?php

namespace Database\Seeders;

use App\Models\JobPosts;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobPostsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        JobPosts::factory()->count(10)->create();
    }
}
