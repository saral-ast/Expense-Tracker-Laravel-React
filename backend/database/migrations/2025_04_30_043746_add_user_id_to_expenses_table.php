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
        Schema::table('expenses', function (Blueprint $table) {
            if (!Schema::hasColumn('expenses', 'user_id')) {
                // Add user_id column after group_id column
                $table->foreignIdFor(\App\Models\User::class, 'user_id')
                    ->after('group_id')
                    ->constrained()
                    ->cascadeOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
               if (Schema::hasColumn('expenses', 'user_id')) {
                // Drop the foreign key constraint first
                $table->dropForeign(['user_id']);
                // Then drop the column
                $table->dropColumn('user_id');
            }
        });
    }
};