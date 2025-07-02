# User Activity Logging System Documentation

## Overview

The User Activity Logging System tracks and records user actions throughout the Cambodia Land Purchase Tracking System. It provides comprehensive monitoring of user behavior, enabling administrators to review system usage, troubleshoot issues, and maintain an audit trail for security and compliance purposes.

## Features

- **Automatic Activity Logging**: Middleware automatically logs key user actions
- **Role-Based Access Control**: Different access levels based on user roles
- **Dashboard Integration**: Recent activities displayed on the dashboard
- **Filtering and Pagination**: Advanced filtering options with pagination
- **Automatic Cleanup**: Scheduled command to remove old activity logs
- **Khmer Language Support**: Full localization of activity logs

## Components

### Backend Components

1. **UserActivity Model**
   - Stores activity data including user ID, action, description, and IP address
   - Maintains timestamps for when activities occurred
   - Includes relationship to User model

2. **UserActivityService**
   - Provides centralized logging functionality
   - Methods for recording different types of activities
   - Handles IP address detection and formatting

3. **LogUserActivity Middleware**
   - Automatically logs authentication events
   - Can be applied to specific routes that need activity logging

4. **CleanupUserActivities Command**
   - Artisan command to remove old activity logs
   - Configurable retention period (default: 90 days)
   - Scheduled to run monthly via Laravel scheduler

5. **UserActivityController**
   - Handles requests to view activity logs
   - Implements filtering and pagination
   - Enforces access control based on user roles

6. **UserActivityPolicy**
   - Defines authorization rules for viewing activities
   - Ensures users can only view their own activities unless they have admin/manager role

### Frontend Components

1. **Dashboard Activity Widget**
   - Displays recent user activities on the dashboard
   - Shows user name, action, description, and formatted timestamp

2. **Activities Index Page**
   - Lists all user activities with filtering and pagination
   - Accessible only to administrators and managers
   - Includes filters for user, action type, and date range

3. **My Activities Page**
   - Shows activities for the currently logged-in user
   - Includes pagination for browsing through activity history

## Usage

### Recording Activities

Activities are recorded automatically for authentication events. For custom actions, use the UserActivityService:

```php
// In a controller
use App\Services\UserActivityService;

public function store(Request $request, UserActivityService $activityService)
{
    // Process the request...
    
    // Log the activity
    $activityService->log(
        auth()->user()->id,
        'បង្កើតទិន្នន័យថ្មី', // Create new data
        'បង្កើតកំណត់ត្រាដីថ្មី' // Created new land record
    );
    
    // Continue with the response...
}
```

### Viewing Activities

- Administrators and managers can view all activities at `/activities`
- All users can view their own activities at `/my-activities`
- Recent activities are displayed on the dashboard

### Cleaning Up Old Activities

The system automatically cleans up activities older than 90 days on a monthly schedule. To run the cleanup manually:

```bash
php artisan activities:cleanup

# With custom retention period
php artisan activities:cleanup --days=30
```

## Database Schema

The `user_activities` table has the following structure:

| Column       | Type         | Description                           |
|--------------|--------------|---------------------------------------|
| id           | bigint       | Primary key                           |
| user_id      | bigint       | Foreign key to users table            |
| action       | string       | Type of action performed              |
| description  | text         | Detailed description of the activity  |
| ip_address   | string       | IP address of the user                |
| created_at   | timestamp    | When the activity was recorded        |
| updated_at   | timestamp    | When the record was last updated      |

## Access Control

- **Administrators**: Can view all user activities
- **Managers**: Can view all user activities
- **Staff**: Can only view their own activities

## Localization

All activity logs are displayed with Khmer language labels and descriptions. The system uses the following translations:

- Actions: Login, Logout, View data, Create data, Edit data, Delete data
- Descriptions: Context-specific descriptions of the actions
- UI elements: All headings, labels, and buttons are in Khmer

## Best Practices

1. **Be Descriptive**: Use clear and specific action names and descriptions
2. **Don't Log Sensitive Data**: Never include passwords or sensitive information in activity logs
3. **Regular Cleanup**: Maintain appropriate retention policies for activity data
4. **Performance Considerations**: Activity logging is designed to have minimal impact on system performance
