# ប្រព័ន្ធតាមដានដី - Cambodia Land Purchase Tracking System

<p align="center">
<img src="https://img.shields.io/badge/Laravel-11-FF2D20" alt="Laravel 11">
<img src="https://img.shields.io/badge/React-18-61DAFB" alt="React 18">
<img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript 5">
<img src="https://img.shields.io/badge/Ant%20Design-5-0170FE" alt="Ant Design 5">
<img src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4" alt="Tailwind CSS 3">
</p>

## About The Project

Cambodia Land Purchase Tracking System is a comprehensive web application designed for real estate companies in Cambodia to manage land purchases, track payments, handle documents, and monitor user activities. The system is built with Laravel 11 and React 18, featuring a fully localized Khmer language interface.

### Key Features

- Land record management with document uploads
- Payment tracking and reporting
- Commission management
- User management with role-based access control
- Comprehensive user activity logging
- Fully localized Khmer language interface

## User Activity Logging System

The system includes a comprehensive user activity logging feature that tracks and records user actions throughout the application:

### Features

- **Automatic Activity Logging**: Middleware automatically logs key user actions such as login, logout, and profile updates
- **Role-Based Access Control**: Administrators and managers can view all user activities, while regular users can only view their own
- **Dashboard Integration**: Recent activities displayed on the dashboard for quick monitoring
- **Filtering and Pagination**: Advanced filtering by user, action type, and date range with pagination support
- **Automatic Cleanup**: Scheduled command to clean up old activity logs to prevent database bloat
- **Khmer Language Support**: All activity logs displayed with Khmer language labels and descriptions

### Components

- `LogUserActivity` middleware for automatic logging
- `UserActivity` model and migration for data storage
- `UserActivityService` for centralized logging functionality
- `UserActivityController` for handling activity display requests
- `UserActivityPolicy` for authorization rules
- React components for displaying activities with filtering and pagination

## Technology Stack

- **Backend**: Laravel 11 with PHP 8.2
- **Frontend**: React 18 with TypeScript 5
- **UI Framework**: Ant Design 5 with Tailwind CSS 3
- **State Management**: Inertia.js for seamless Laravel-React integration
- **Authentication**: Laravel Breeze
- **Database**: MySQL
- **Localization**: Full Khmer language support with dayjs for date formatting
- **Testing**: PHPUnit for backend, Jest for frontend

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cambodia-land-tracker.git
cd cambodia-land-tracker

# Install PHP dependencies
composer install

# Install NPM dependencies
npm install

# Copy environment file and configure your database
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seeders
php artisan migrate --seed

# Build assets
npm run build

# Start the development server
php artisan serve
```

## User Roles

The system has three user roles with different permissions:

1. **Administrator** - Full access to all features
2. **Manager** - Access to most features except user management
3. **Staff** - Limited access to basic features

## Commands

```bash
# Clean up old user activities (older than 90 days by default)
php artisan activities:cleanup

# Specify custom retention period in days
php artisan activities:cleanup --days=30
```

## Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=UserActivityTest
```

## Screenshots

*Dashboard with recent activities*
![Dashboard](screenshots/dashboard.png)

*User activity logs*
![User Activities](screenshots/activities.png)

*My activities page*
![My Activities](screenshots/my-activities.png)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
