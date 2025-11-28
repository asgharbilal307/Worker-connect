<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('job_posts', 'assigned_to')) {
                $table->unsignedBigInteger('assigned_to')->nullable()->after('id');
            }

            if (!Schema::hasColumn('job_posts', 'rejected_by')) {
                $table->json('rejected_by')->nullable()->after('assigned_to');
            }

            // Add FK only for assigned_to (single worker)
            $table->foreign('assigned_to')
                ->references('id')
                ->on('workers')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn(['assigned_to', 'rejected_by']);
        });
    }
};
