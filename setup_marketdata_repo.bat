@echo off
echo Setting up Market Data Repository...

REM Create marketdata directory
mkdir gcx-marketdata
cd gcx-marketdata

REM Initialize git repository
git init

REM Copy marketdata files
xcopy /E /I ..\gcx_marketdata\* .

REM Create .gitignore for Next.js
echo # Dependencies > .gitignore
echo node_modules/ >> .gitignore
echo /.next/ >> .gitignore
echo /out/ >> .gitignore
echo .env.local >> .gitignore
echo .env.*.local >> .gitignore
echo npm-debug.log* >> .gitignore
echo yarn-debug.log* >> .gitignore
echo yarn-error.log* >> .gitignore
echo pnpm-debug.log* >> .gitignore
echo lerna-debug.log* >> .gitignore
echo .DS_Store >> .gitignore
echo .vscode/ >> .gitignore
echo .idea/ >> .gitignore

REM Create README for marketdata
echo # GCX Market Data - Next.js Application > README.md
echo. >> README.md
echo A modern Next.js 15 application for GCX market data visualization and trading platform. >> README.md
echo. >> README.md
echo ## Tech Stack >> README.md
echo - Next.js 15 with App Router >> README.md
echo - React 19 >> README.md
echo - TypeScript >> README.md
echo - Tailwind CSS >> README.md
echo - Recharts for data visualization >> README.md
echo - Stripe for payments >> README.md
echo. >> README.md
echo ## Quick Start >> README.md
echo ```bash >> README.md
echo npm install >> README.md
echo npm run dev >> README.md
echo ``` >> README.md

REM Add and commit
git add .
git commit -m "Initial commit: Next.js market data application"

echo Market Data repository setup complete!
echo Next: Add remote and push to GitHub
echo git remote add origin https://github.com/YOUR_USERNAME/gcx-marketdata.git
echo git push -u origin main

pause
