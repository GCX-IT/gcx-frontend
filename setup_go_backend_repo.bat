@echo off
echo Setting up Go Backend Repository...

REM Create go-backend directory
mkdir gcx-go-backend
cd gcx-go-backend

REM Initialize git repository
git init

REM Copy go-backend files
xcopy /E /I ..\go-backend\* .

REM Create .gitignore for Go
echo # Binaries for programs and plugins > .gitignore
echo *.exe >> .gitignore
echo *.exe~ >> .gitignore
echo *.dll >> .gitignore
echo *.so >> .gitignore
echo *.dylib >> .gitignore
echo. >> .gitignore
echo # Test binary, built with 'go test -c' >> .gitignore
echo *.test >> .gitignore
echo. >> .gitignore
echo # Output of the go coverage tool >> .gitignore
echo *.out >> .gitignore
echo. >> .gitignore
echo # Dependency directories >> .gitignore
echo vendor/ >> .gitignore
echo. >> .gitignore
echo # Go workspace file >> .gitignore
echo go.work >> .gitignore
echo. >> .gitignore
echo # Environment variables >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo. >> .gitignore
echo # IDE files >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore
echo *.swp >> .gitignore
echo *.swo >> .gitignore

REM Create README for go-backend
echo # GCX Go Backend - High-Performance API > README.md
echo. >> README.md
echo A high-performance Go backend API for the GCX platform with CMS functionality and market data services. >> README.md
echo. >> README.md
echo ## Tech Stack >> README.md
echo - Go 1.21 >> README.md
echo - Gin web framework >> README.md
echo - GORM for database operations >> README.md
echo - MySQL/PostgreSQL/SQLite support >> README.md
echo - JWT authentication >> README.md
echo. >> README.md
echo ## Quick Start >> README.md
echo ```bash >> README.md
echo go mod tidy >> README.md
echo go run main.go >> README.md
echo ``` >> README.md

REM Add and commit
git add .
git commit -m "Initial commit: Go backend API"

echo Go Backend repository setup complete!
echo Next: Add remote and push to GitHub
echo git remote add origin https://github.com/YOUR_USERNAME/gcx-go-backend.git
echo git push -u origin main

pause
