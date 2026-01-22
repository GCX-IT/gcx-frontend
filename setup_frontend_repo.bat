@echo off
echo Setting up Frontend Repository...

REM Create frontend directory
mkdir gcx-frontend
cd gcx-frontend

REM Initialize git repository
git init

REM Copy frontend files
xcopy /E /I ..\frontend\* .

REM Create .gitignore for Vue.js
echo # Dependencies > .gitignore
echo node_modules/ >> .gitignore
echo /dist >> .gitignore
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

REM Create README for frontend
echo # GCX Frontend - Vue.js Application > README.md
echo. >> README.md
echo A modern Vue.js 3 application for the GCX website featuring responsive design, blog system, and real-time data integration. >> README.md
echo. >> README.md
echo ## Tech Stack >> README.md
echo - Vue.js 3 with Composition API >> README.md
echo - TypeScript for type safety >> README.md
echo - Vite for fast development >> README.md
echo - Tailwind CSS for styling >> README.md
echo - PrimeVue for UI components >> README.md
echo - Pinia for state management >> README.md
echo. >> README.md
echo ## Quick Start >> README.md
echo ```bash >> README.md
echo npm install >> README.md
echo npm run dev >> README.md
echo ``` >> README.md

REM Add and commit
git add .
git commit -m "Initial commit: Vue.js frontend application"

echo Frontend repository setup complete!
echo Next: Add remote and push to GitHub
echo git remote add origin https://github.com/YOUR_USERNAME/gcx-frontend.git
echo git push -u origin main

pause
