#!/bin/bash

# GCX Website Production Deployment Script
# This script builds and deploys all components for production

set -e

echo "🚀 Starting GCX Website Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed"
        exit 1
    fi
    
    if ! command -v composer &> /dev/null; then
        print_error "Composer is not installed"
        exit 1
    fi
    
    print_status "All dependencies are installed ✓"
}

# Build Frontend (Vue.js)
build_frontend() {
    print_status "Building Frontend (Vue.js)..."
    cd frontend
    
    # Install dependencies
    npm ci
    
    # Build for production
    npm run build
    
    cd ..
    print_status "Frontend build completed ✓"
}

# Build Market Data App (Next.js)
build_marketdata() {
    print_status "Building Market Data App (Next.js)..."
    cd gcx_marketdata
    
    # Install dependencies
    npm ci
    
    # Build for production
    npm run build
    
    cd ..
    print_status "Market Data App build completed ✓"
}

# Build Laravel Backend
build_laravel() {
    print_status "Building Laravel Backend..."
    cd backend
    
    # Install dependencies
    composer install --no-dev --optimize-autoloader
    
    # Clear and cache configurations
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    
    cd ..
    print_status "Laravel Backend build completed ✓"
}

# Build Go Backend
build_go() {
    print_status "Building Go Backend..."
    cd go-backend
    
    # Download dependencies
    go mod tidy
    
    # Build for production
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o gcx-server main.go
    
    cd ..
    print_status "Go Backend build completed ✓"
}

# Create production directories
create_directories() {
    print_status "Creating production directories..."
    
    mkdir -p production/frontend
    mkdir -p production/marketdata
    mkdir -p production/backend
    mkdir -p production/go-backend
    mkdir -p production/nginx
    mkdir -p production/ssl
    
    print_status "Production directories created ✓"
}

# Copy built files to production directories
copy_files() {
    print_status "Copying built files to production directories..."
    
    # Copy frontend build
    cp -r frontend/dist/* production/frontend/
    
    # Copy marketdata build
    cp -r gcx_marketdata/.next production/marketdata/
    cp -r gcx_marketdata/public production/marketdata/
    cp gcx_marketdata/package.json production/marketdata/
    
    # Copy Laravel files
    cp -r backend/* production/backend/
    rm -rf production/backend/node_modules
    rm -rf production/backend/tests
    
    # Copy Go binary
    cp go-backend/gcx-server production/go-backend/
    cp -r go-backend/uploads production/go-backend/
    
    # Copy nginx config
    cp nginx.conf production/nginx/
    
    print_status "Files copied to production directories ✓"
}

# Generate SSL certificates (self-signed for development)
generate_ssl() {
    print_status "Generating SSL certificates..."
    
    if [ ! -f production/ssl/cert.pem ]; then
        openssl req -x509 -newkey rsa:4096 -keyout production/ssl/key.pem -out production/ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        print_status "SSL certificates generated ✓"
    else
        print_warning "SSL certificates already exist, skipping..."
    fi
}

# Create production environment files
create_env_files() {
    print_status "Creating production environment files..."
    
    # Copy example environment files
    cp production.env.example production/.env
    
    print_warning "Please update production/.env with your production values"
    print_status "Environment files created ✓"
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    check_dependencies
    create_directories
    build_frontend
    build_marketdata
    build_laravel
    build_go
    copy_files
    generate_ssl
    create_env_files
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Next steps:"
    print_status "1. Update production/.env with your production values"
    print_status "2. Configure your web server (Nginx/Apache)"
    print_status "3. Set up SSL certificates"
    print_status "4. Start your services"
    print_status ""
    print_status "Production files are in the 'production' directory"
}

# Run main function
main "$@"
