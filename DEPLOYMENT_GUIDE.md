# GCX Website - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Go 1.21+
- MySQL 8.0+
- Composer
- Docker (optional)

### One-Command Deployment

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
./deploy.sh
```

**Docker:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Manual Deployment Steps

### 1. Environment Setup

1. Copy environment template:
```bash
cp production.env.example .env
```

2. Update `.env` with your production values:
```env
APP_NAME="GCX Website"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_PASSWORD=your_secure_password
JWT_SECRET=your-jwt-secret
```

### 2. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE gcx_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Run migrations:
```bash
# Laravel migrations
cd backend
php artisan migrate --force
php artisan db:seed --force

# Go migrations
cd ../go-backend
go run cmd/migrate-all/main.go
```

### 3. Build Applications

**Frontend (Vue.js):**
```bash
cd frontend
npm ci
npm run build:prod
```

**Market Data App (Next.js):**
```bash
cd gcx_marketdata
npm ci
npm run build:prod
```

**Laravel Backend:**
```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Go Backend:**
```bash
cd go-backend
go mod tidy
go build -o gcx-server main.go
```

### 4. Web Server Configuration

#### Nginx Configuration
```nginx
# Main website
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        root /var/www/gcx/frontend;
        try_files $uri $uri/ /index.html;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Market Data App
server {
    listen 443 ssl http2;
    server_name marketdata.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/gcx/frontend
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    # API Proxy
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:8000/api/
    ProxyPassReverse /api/ http://localhost:8000/api/
</VirtualHost>
```

### 5. Process Management

#### Using PM2 (Node.js)
```bash
# Install PM2
npm install -g pm2

# Start applications
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Using Supervisor (PHP/Go)
```ini
[program:laravel]
command=php artisan serve --host=0.0.0.0 --port=8000
directory=/var/www/gcx/backend
autostart=true
autorestart=true

[program:go-backend]
command=/var/www/gcx/go-backend/gcx-server
directory=/var/www/gcx/go-backend
autostart=true
autorestart=true
```

## 🔧 Configuration Files

### Frontend Environment
```env
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=GCX Website
VITE_APP_ENV=production
```

### Market Data App Environment
```env
NEXTAUTH_URL=https://marketdata.your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
DATABASE_URL=mysql://user:pass@localhost:3306/gcx_website
```

### Laravel Environment
```env
APP_NAME="GCX Website"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gcx_website
DB_USERNAME=your_username
DB_PASSWORD=your_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Go Backend Environment
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=gcx_website
JWT_SECRET=your-jwt-secret
PORT=8080
```

## 📊 Monitoring Setup

### Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2
npm install -g clinic

# Monitor performance
clinic doctor -- node server.js
```

### Log Management
```bash
# Centralized logging
tail -f /var/log/gcx/application.log
tail -f /var/log/gcx/error.log
```

### Health Checks
```bash
# API health check
curl https://your-domain.com/api/health

# Database health check
curl https://your-domain.com/api/db-health
```

## 🔄 Maintenance Tasks

### Daily
- [ ] Check application logs
- [ ] Monitor server resources
- [ ] Verify backup completion

### Weekly
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Test backup restoration

### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] SSL certificate renewal

## 🚨 Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check logs
pm2 logs
tail -f /var/log/gcx/error.log

# Check dependencies
npm ci
composer install
```

**Database connection issues:**
```bash
# Test connection
mysql -u username -p -h localhost gcx_website

# Check Laravel config
php artisan config:clear
php artisan config:cache
```

**SSL certificate issues:**
```bash
# Test SSL
openssl s_client -connect your-domain.com:443

# Renew certificate
certbot renew
```

### Performance Issues

**Slow database queries:**
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

**High memory usage:**
```bash
# Monitor memory
htop
free -h

# Optimize PHP
php.ini: memory_limit = 512M
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Review this guide
3. Check security checklist
4. Contact development team

---

**Last Updated**: $(date)
**Version**: 1.0.0
