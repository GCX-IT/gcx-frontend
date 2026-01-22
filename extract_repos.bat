@echo off
echo Starting repository extraction process...

REM Create a temporary directory for extraction
mkdir temp_extraction
cd temp_extraction

echo.
echo ============================================
echo Extracting Frontend (Vue.js) Repository
echo ============================================

REM Extract frontend with git history
git subtree split --prefix=frontend -b frontend-branch
git checkout frontend-branch
git remote add frontend-origin https://github.com/YOUR_USERNAME/gcx-frontend.git
echo Frontend extracted. Ready to push to: https://github.com/YOUR_USERNAME/gcx-frontend.git

echo.
echo ============================================
echo Extracting Market Data (Next.js) Repository  
echo ============================================

REM Go back to main repo
cd ..
cd temp_extraction
git checkout v1
git subtree split --prefix=gcx_marketdata -b marketdata-branch
git checkout marketdata-branch
git remote add marketdata-origin https://github.com/YOUR_USERNAME/gcx-marketdata.git
echo Market Data extracted. Ready to push to: https://github.com/YOUR_USERNAME/gcx-marketdata.git

echo.
echo ============================================
echo Extracting Go Backend Repository
echo ============================================

REM Go back to main repo
cd ..
cd temp_extraction
git checkout v1
git subtree split --prefix=go-backend -b go-backend-branch
git checkout go-backend-branch
git remote add go-backend-origin https://github.com/YOUR_USERNAME/gcx-go-backend.git
echo Go Backend extracted. Ready to push to: https://github.com/YOUR_USERNAME/gcx-go-backend.git

echo.
echo ============================================
echo Extracting Laravel Backend Repository
echo ============================================

REM Go back to main repo
cd ..
cd temp_extraction
git checkout v1
git subtree split --prefix=backend -b laravel-backend-branch
git checkout laravel-backend-branch
git remote add laravel-backend-origin https://github.com/YOUR_USERNAME/gcx-laravel-backend.git
echo Laravel Backend extracted. Ready to push to: https://github.com/YOUR_USERNAME/gcx-laravel-backend.git

echo.
echo ============================================
echo Extraction Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Replace YOUR_USERNAME with your actual GitHub username in the URLs above
echo 2. Push each branch to its respective repository:
echo    - git push frontend-origin frontend-branch:main
echo    - git push marketdata-origin marketdata-branch:main  
echo    - git push go-backend-origin go-backend-branch:main
echo    - git push laravel-backend-origin laravel-backend-branch:main
echo.
echo 3. Clean up temporary files: rmdir /s temp_extraction
echo.
pause
