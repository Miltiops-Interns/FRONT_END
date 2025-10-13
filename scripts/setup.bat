@echo off
echo 🏨 Hotel Website Setup Script
echo ==============================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version:
npm --version

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Check if .env files exist
echo.
echo 🔧 Checking environment files...

if not exist ".env" (
    echo ⚠️  Frontend .env file not found. Creating from template...
    copy env.example .env
    echo ✅ Created .env file. Please edit it with your configuration.
)

if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Creating from template...
    copy backend\env.example backend\.env
    echo ✅ Created backend\.env file. Please edit it with your configuration.
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit backend\.env with your MongoDB Atlas credentials
echo 2. Edit .env with your backend URL
echo 3. Start the backend: cd backend ^&^& npm start
echo 4. Start the frontend: npm start
echo 5. Create admin user using the API
echo.
echo 📚 For detailed instructions, see:
echo    - SETUP.md for local development
echo    - DEPLOYMENT.md for production deployment
echo.
echo 🚀 Happy coding!
pause
