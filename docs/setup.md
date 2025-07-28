# Cambodia Land Tracker - Installation Guide for Ubuntu 22.04

This guide provides step-by-step instructions for setting up the Cambodia Land Tracker application on Ubuntu 22.04 with PHP 8.2 and Node.js v20.9.0.

## System Requirements

- Ubuntu 22.04 LTS
- PHP 8.2
- Node.js v20.9.0
- MySQL 8.0 (or MariaDB 10.6+)
- Composer 2.x
- npm 10.x (comes with Node.js v20.9.0)

## 1. Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

## 2. Install Required System Dependencies

```bash
sudo apt install -y software-properties-common curl zip unzip git
```

## 3. Install PHP 8.2 and Required Extensions

```bash
# Add PHP repository
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP 8.2 and required extensions
sudo apt install -y php8.2 php8.2-cli php8.2-common php8.2-curl php8.2-mbstring \
php8.2-xml php8.2-zip php8.2-bcmath php8.2-intl php8.2-mysql php8.2-sqlite3 \
php8.2-gd php8.2-fpm php8.2-redis php8.2-dom php8.2-fileinfo php8.2-tokenizer
```

## 4. Install Composer (PHP Dependency Manager)

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

## 5. Install Node.js v20.9.0 and npm

```bash
# Install Node.js using NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js v20.9.0
nvm install 20.9.0
nvm use 20.9.0

# Verify installation
node -v  # Should output v20.9.0
npm -v   # Should output 10.x.x
```

## 6. Install MySQL Server

```bash
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql
```

## 7. Create MySQL Database and User

```bash
sudo mysql -e "CREATE DATABASE onc_land_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'onc_villa'@'localhost' IDENTIFIED BY 'm[LVBvgi$v85wM.Y';"
sudo mysql -e "GRANT ALL PRIVILEGES ON onc_land_tracker.* TO 'onc_villa'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

Replace `'your_secure_password'` with a strong password.

## 8. Generate SSH Key and Add to GitHub

```bash
# Generate SSH key (press Enter to accept default file location, then enter a secure passphrase)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Start the SSH agent in the background
eval "$(ssh-agent -s)"

# Add your SSH key to the SSH agent
ssh-add ~/.ssh/id_ed25519

# Display the public key to copy to GitHub
cat ~/.ssh/id_ed25519.pub
```

Now copy the displayed public key and add it to your GitHub account:

1. Log in to GitHub
2. Click on your profile photo in the top right corner
3. Click on "Settings"
4. In the left sidebar, click on "SSH and GPG keys"
5. Click on "New SSH key"
6. Give your key a descriptive title (e.g., "Ubuntu Server")
7. Paste your public key into the "Key" field
8. Click "Add SSH key"

Test your SSH connection to GitHub:

```bash
ssh -T git@github.com
```

You should see a message like: "Hi username! You've successfully authenticated, but GitHub does not provide shell access."

## 9. Clone the Repository

```bash
# Navigate to your desired location
cd /var/www/html  # or your preferred location

# Clone the repository using SSH
git clone git@github.com:yourusername/cambodia-land-tracker.git

# Navigate to the project directory
cd cambodia-land-tracker
```

## 10. Install PHP Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

## 11. Set Up Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

## 12. Configure the .env File

Edit the `.env` file to set your database and application configuration:

```bash
nano .env
```

Update the following sections:

```
APP_NAME="Onc Villa Land Tracker"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://your-domain-or-ip

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=onc_land_tracker
DB_USERNAME=onc_villa
DB_PASSWORD=m[LVBvgi$v85wM.Y
```

Also update the timezone to Cambodia's timezone:

```
APP_TIMEZONE=Asia/Phnom_Penh
```

## 13. Install Node.js Dependencies and Build Assets

```bash
# Install dependencies
npm install

# Build assets for production
npm run build
```

## 14. Run Database Migrations and Seed Data

```bash
# Run migrations
php artisan migrate

# Seed the database with initial data
php artisan db:seed
```

## 15. Set Proper Permissions

```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/onc-land-purchase-tracking-system
# Or if you're using a different location, adjust accordingly

# Set proper permissions
sudo find /var/www/onc-land-purchase-tracking-system -type f -exec chmod 644 {} \;
sudo find /var/www/onc-land-purchase-tracking-system -type d -exec chmod 755 {} \;

# Make storage and bootstrap/cache directories writable
sudo chmod -R 775 /var/www/onc-land-purchase-tracking-system/storage
sudo chmod -R 775 /var/www/onc-land-purchase-tracking-system/bootstrap/cache
```

## 16. Set Up Symbolic Link for Storage

```bash
php artisan storage:link
```

## 17. Configure Web Server (Apache)

If you're using Apache:

```bash
# Install Apache
sudo apt install -y apache2 libapache2-mod-php8.2

# Enable required Apache modules
sudo a2enmod rewrite
sudo a2enmod php8.2

# Create a new virtual host configuration
sudo nano /etc/apache2/sites-available/cambodia-land-tracker.conf
```

Add the following configuration:

```apache
<VirtualHost *:80>
    ServerName your-domain-or-ip
    DocumentRoot /var/www/onc-land-purchase-tracking-system/public

    <Directory /var/www/onc-land-purchase-tracking-system/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/cambodia-land-tracker-error.log
    CustomLog ${APACHE_LOG_DIR}/cambodia-land-tracker-access.log combined
</VirtualHost>
```

Enable the site and restart Apache:

```bash
sudo a2ensite cambodia-land-tracker.conf
sudo systemctl restart apache2
```

## 18. Configure Web Server (Nginx)

If you prefer Nginx:

```bash
# Install Nginx
sudo apt install -y nginx

# Create a new server block configuration
sudo nano /etc/nginx/sites-available/onc-land-purchase-tracking-system
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain-or-ip;
    root /var/www/onc-land-purchase-tracking-system/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/onc-land-purchase-tracking-system /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 19. Set Up Queue Worker (Optional but Recommended)

For background processing tasks:

```bash
# Install Supervisor to manage queue workers
sudo apt install -y supervisor

# Create a new configuration file
sudo nano /etc/supervisor/conf.d/onc-land-purchase-tracking-system-worker.conf
```

Add the following configuration:

```
[program:onc-land-purchase-tracking-system-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/onc-land-purchase-tracking-system/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/onc-land-purchase-tracking-system/storage/logs/worker.log
stopwaitsecs=3600
```

Reload Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

## 20. Set Up Scheduled Tasks

Add Laravel's scheduler to the crontab:

```bash
sudo crontab -e
```

Add the following line:

```
* * * * * cd /var/www/onc-land-purchase-tracking-system && php artisan schedule:run >> /dev/null 2>&1
```

## 21. Verify Installation

Open your browser and navigate to your server's domain or IP address. You should see the Cambodia Land Tracker login page.

## Default User Credentials

If the database was seeded with default users, you can log in with:

- Email: admin@example.com
- Password: password

**Important:** Change the default password immediately after your first login!

## Troubleshooting

### Permission Issues

If you encounter permission issues:

```bash
sudo chown -R www-data:www-data /var/www/onc-land-purchase-tracking-system/storage
sudo chown -R www-data:www-data /var/www/onc-land-purchase-tracking-system/bootstrap/cache
```

### Laravel Error Logs

Check Laravel logs for errors:

```bash
tail -f /var/www/onc-land-purchase-tracking-system/storage/logs/laravel.log
```

### Web Server Logs

For Apache:

```bash
tail -f /var/log/apache2/           onc-land-purchase-tracking-system-error.log
```

For Nginx:

```bash
tail -f /var/log/nginx/error.log
```

## Maintenance Commands

### Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Clean Up Old User Activities

```bash
php artisan activities:cleanup
```

### Update Application

```bash
git pull
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan migrate
php artisan optimize:clear
php artisan optimize
```
