<?php

namespace App\Console\Commands;

use App\Models\UserActivity;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CleanupUserActivities extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'activities:cleanup {--days=90 : Number of days to keep activities}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old user activities from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $date = Carbon::now()->subDays($days);
        
        $count = UserActivity::where('created_at', '<', $date)->delete();
        
        $this->info("Deleted {$count} user activities older than {$days} days.");
        
        return Command::SUCCESS;
    }
}
