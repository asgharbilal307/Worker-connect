<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            // nothing here for Postgres, enum changing doesn't work
        });

        // Laravel + Postgres compatible
        DB::statement("ALTER TABLE job_posts DROP CONSTRAINT IF EXISTS job_posts_status_check");

        DB::statement("
            ALTER TABLE job_posts
            ADD CONSTRAINT job_posts_status_check
            CHECK (status IN ('active', 'inactive', 'in_process', 'completed'))
        ");
    }

    public function down(): void
    {
        // Revert back to old allowed values
        DB::statement("ALTER TABLE job_posts DROP CONSTRAINT IF EXISTS job_posts_status_check");

        DB::statement("
            ALTER TABLE job_posts
            ADD CONSTRAINT job_posts_status_check
            CHECK (status IN ('active', 'inactive'))
        ");
    }
};
