# GCX Website - Production Deployment Guide

## 🏗️ Project Architecture

This is a multi-component application consisting of:

- **Frontend**: Vue.js 3 + TypeScript + Vite
- **Backend**: Laravel 12 (PHP 8.2+)
- **Go Backend**: Go 1.21 with Gin framework
- **Market Data App**: Next.js 15 with React 19

## 🚀 Production Setup

### Prerequisites
- Node.js 18+ 
- PHP 8.2+
- Go 1.21+
- MySQL 8.0+
- Composer
- Git

### Environment Configuration

#### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=GCX Website
VITE_APP_ENV=production
```

#### Backend (.env)
```env
APP_NAME="GCX Website"
APP_ENV=production
APP_KEY=base64:your-generated-key
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

#### Go Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=gcx_website
JWT_SECRET=your-jwt-secret
PORT=8080
```

#### Market Data App (.env.local)
```env
NEXTAUTH_URL=https://your-marketdata-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
DATABASE_URL=mysql://username:password@localhost:3306/gcx_website
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
```

## 🔧 Build Commands

### Frontend
```bash
cd frontend
npm ci
npm run build
```

### Backend
```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Go Backend
```bash
cd go-backend
go mod tidy
go build -o gcx-server main.go
```

### Market Data App
```bash
cd gcx_marketdata
npm ci
npm run build
```

## 🗄️ Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE gcx_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Run Laravel migrations:
```bash
cd backend
php artisan migrate --force
php artisan db:seed --force
```

3. Run Go migrations:
```bash
cd go-backend
go run cmd/migrate-all/main.go
```

## 🚀 Deployment

### Using Docker (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
1. Build all components
2. Configure web server (Nginx/Apache)
3. Set up SSL certificates
4. Configure process manager (PM2 for Node.js, Supervisor for PHP/Go)

## 🔒 Security Checklist

- [ ] Set `APP_DEBUG=false` in Laravel
- [ ] Use strong, unique secrets for JWT and NextAuth
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Enable database query logging
- [ ] Configure proper file permissions
- [ ] Set up monitoring and logging

## 📊 Monitoring

- Application logs: `/var/log/gcx/`
- Database monitoring: MySQL performance schema
- Server monitoring: System metrics
- Error tracking: Consider Sentry integration

## 🔄 Maintenance

### Regular Tasks
- Database backups
- Log rotation
- Security updates
- Performance monitoring
- SSL certificate renewal

### Updates
1. Test in staging environment
2. Backup production database
3. Deploy updates during maintenance window
4. Monitor for issues
5. Rollback if necessary

## 📞 Support

For production issues:
1. Check application logs
2. Verify database connectivity
3. Check server resources
4. Review recent deployments
5. Contact development team

---

**Last Updated**: $(date)
**Version**: 1.0.0
