@echo off
echo 🚀 Starting GCX Website Production Deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    exit /b 1
)

REM Check if Go is installed
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Go is not installed
    exit /b 1
)

echo [INFO] All dependencies are installed ✓

REM Create production directories
echo [INFO] Creating production directories...
if not exist "production" mkdir production
if not exist "production\frontend" mkdir production\frontend
if not exist "production\marketdata" mkdir production\marketdata
if not exist "production\backend" mkdir production\backend
if not exist "production\go-backend" mkdir production\go-backend
if not exist "production\nginx" mkdir production\nginx
if not exist "production\ssl" mkdir production\ssl

REM Build Frontend
echo [INFO] Building Frontend (Vue.js)...
cd frontend
call npm ci
call npm run build
cd ..

REM Copy frontend build
xcopy /E /I /Y "frontend\dist\*" "production\frontend\"

REM Build Market Data App
echo [INFO] Building Market Data App (Next.js)...
cd gcx_marketdata
call npm ci
call npm run build
cd ..

REM Copy marketdata build
xcopy /E /I /Y "gcx_marketdata\.next" "production\marketdata\.next\"
xcopy /E /I /Y "gcx_marketdata\public" "production\marketdata\public\"
copy /Y "gcx_marketdata\package.json" "production\marketdata\"

REM Build Go Backend
echo [INFO] Building Go Backend...
cd go-backend
go mod tidy
go build -o gcx-server.exe main.go
cd ..

REM Copy Go binary
copy /Y "go-backend\gcx-server.exe" "production\go-backend\"
xcopy /E /I /Y "go-backend\uploads" "production\go-backend\uploads\"

REM Copy nginx config
copy /Y "nginx.conf" "production\nginx\"

REM Copy environment file
copy /Y "production.env.example" "production\.env"

echo [INFO] 🎉 Deployment completed successfully!
echo [INFO] Next steps:
echo [INFO] 1. Update production\.env with your production values
echo [INFO] 2. Configure your web server (Nginx/Apache)
echo [INFO] 3. Set up SSL certificates
echo [INFO] 4. Start your services
echo [INFO] Production files are in the 'production' directory

pause
