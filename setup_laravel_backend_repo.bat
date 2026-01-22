@echo off
echo Setting up Laravel Backend Repository...

REM Create laravel-backend directory
mkdir gcx-laravel-backend
cd gcx-laravel-backend

REM Initialize git repository
git init

REM Copy backend files
xcopy /E /I ..\backend\* .

REM Create .gitignore for Laravel (if not exists)
if not exist .gitignore (
    echo # Dependencies > .gitignore
    echo /vendor/ >> .gitignore
    echo /node_modules/ >> .gitignore
    echo. >> .gitignore
    echo # Environment files >> .gitignore
    echo .env >> .gitignore
    echo .env.backup >> .gitignore
    echo .env.production >> .gitignore
    echo. >> .gitignore
    echo # Laravel specific >> .gitignore
    echo /storage/*.key >> .gitignore
    echo /storage/app/public >> .gitignore
    echo /storage/framework/cache >> .gitignore
    echo /storage/framework/sessions >> .gitignore
    echo /storage/framework/views >> .gitignore
    echo /storage/logs >> .gitignore
    echo /bootstrap/cache >> .gitignore
    echo. >> .gitignore
    echo # IDE files >> .gitignore
    echo .vscode/ >> .gitignore
    echo .idea/ >> .gitignore
    echo *.swp >> .gitignore
    echo *.swo >> .gitignore
    echo. >> .gitignore
    echo # OS files >> .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
)

REM Create README for laravel-backend
echo # GCX Laravel Backend - PHP API > README.md
echo. >> README.md
echo A Laravel 12 API backend for the GCX platform with blog management and CMS functionality. >> README.md
echo. >> README.md
echo ## Tech Stack >> README.md
echo - Laravel 12 >> README.md
echo - PHP 8.2+ >> README.md
echo - MySQL/SQLite database >> README.md
echo - Eloquent ORM >> README.md
echo - RESTful API design >> README.md
echo. >> README.md
echo ## Quick Start >> README.md
echo ```bash >> README.md
echo composer install >> README.md
echo cp .env.example .env >> README.md
echo php artisan key:generate >> README.md
echo php artisan migrate >> README.md
echo php artisan serve >> README.md
echo ``` >> README.md

REM Add and commit
git add .
git commit -m "Initial commit: Laravel backend API"

echo Laravel Backend repository setup complete!
echo Next: Add remote and push to GitHub
echo git remote add origin https://github.com/YOUR_USERNAME/gcx-laravel-backend.git
echo git push -u origin main

pause
