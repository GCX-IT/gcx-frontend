# Repository Separation Guide

This guide will help you separate your monorepo into 4 individual GitHub repositories while preserving git history.

## Overview

Your current structure:
- `frontend/` → `gcx-frontend` (Vue.js 3)
- `gcx_marketdata/` → `gcx-marketdata` (Next.js 15)  
- `go-backend/` → `gcx-go-backend` (Go 1.21)
- `backend/` → `gcx-laravel-backend` (Laravel 12)

## Method 1: Quick Setup (Recommended for New Repos)

### Step 1: Create GitHub Repositories

1. Go to GitHub and create these 4 new repositories:
   - `gcx-frontend`
   - `gcx-marketdata`
   - `gcx-go-backend`
   - `gcx-laravel-backend`

2. Make sure they are **empty** (no README, .gitignore, or license)

### Step 2: Run Setup Scripts

Run these batch files in order:

```bash
# 1. Setup Frontend
setup_frontend_repo.bat

# 2. Setup Market Data
setup_marketdata_repo.bat

# 3. Setup Go Backend
setup_go_backend_repo.bat

# 4. Setup Laravel Backend
setup_laravel_backend_repo.bat
```

### Step 3: Push to GitHub

For each repository, navigate to its folder and push:

```bash
# Frontend
cd gcx-frontend
git remote add origin https://github.com/YOUR_USERNAME/gcx-frontend.git
git push -u origin main

# Market Data
cd ../gcx-marketdata
git remote add origin https://github.com/YOUR_USERNAME/gcx-marketdata.git
git push -u origin main

# Go Backend
cd ../gcx-go-backend
git remote add origin https://github.com/YOUR_USERNAME/gcx-go-backend.git
git push -u origin main

# Laravel Backend
cd ../gcx-laravel-backend
git remote add origin https://github.com/YOUR_USERNAME/gcx-laravel-backend.git
git push -u origin main
```

## Method 2: Preserve Git History (Advanced)

If you want to preserve the complete git history for each folder:

### Step 1: Use Git Subtree

```bash
# Extract frontend with history
git subtree split --prefix=frontend -b frontend-branch
git checkout frontend-branch
git remote add frontend-origin https://github.com/YOUR_USERNAME/gcx-frontend.git
git push frontend-origin frontend-branch:main

# Extract marketdata with history
git checkout v1
git subtree split --prefix=gcx_marketdata -b marketdata-branch
git checkout marketdata-branch
git remote add marketdata-origin https://github.com/YOUR_USERNAME/gcx-marketdata.git
git push marketdata-origin marketdata-branch:main

# Extract go-backend with history
git checkout v1
git subtree split --prefix=go-backend -b go-backend-branch
git checkout go-backend-branch
git remote add go-backend-origin https://github.com/YOUR_USERNAME/gcx-go-backend.git
git push go-backend-origin go-backend-branch:main

# Extract backend with history
git checkout v1
git subtree split --prefix=backend -b laravel-backend-branch
git checkout laravel-backend-branch
git remote add laravel-backend-origin https://github.com/YOUR_USERNAME/gcx-laravel-backend.git
git push laravel-backend-origin laravel-backend-branch:main
```

## After Separation

### 1. Update Documentation

Each repository will have its own README with:
- Specific setup instructions
- Technology stack
- API documentation
- Deployment guides

### 2. Update CI/CD

Each repository can have its own:
- GitHub Actions workflows
- Deployment pipelines
- Testing strategies

### 3. Dependency Management

- Each repo manages its own dependencies
- Clear API contracts between services
- Environment-specific configurations

### 4. Team Collaboration

- Different teams can work on different repositories
- Independent release cycles
- Granular access control

## Benefits of Separation

1. **Independent Development**: Each service can be developed and deployed independently
2. **Technology Focus**: Each repo focuses on its specific technology stack
3. **Team Organization**: Different teams can own different repositories
4. **Scalability**: Easier to scale individual services
5. **Maintenance**: Simpler to maintain and debug individual components

## Next Steps

1. Run the setup scripts
2. Push to GitHub
3. Update any CI/CD pipelines
4. Update team documentation
5. Consider using a monorepo tool like Lerna or Nx if you need to coordinate changes across repos

## Cleanup

After successful separation:
```bash
# Remove temporary files
rmdir /s temp_extraction
del extract_repos.bat
del setup_*_repo.bat
```

## Support

If you encounter any issues:
1. Check that all GitHub repositories are created and empty
2. Verify your GitHub username in the remote URLs
3. Ensure you have proper permissions to push to the repositories
4. Check that each folder has the correct files before pushing
