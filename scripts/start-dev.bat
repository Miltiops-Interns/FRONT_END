@echo off
echo 🚀 Starting Hotel Website in Development Mode
echo =============================================

echo 📦 Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🎨 Starting frontend development server...
start "Frontend Server" cmd /k "npm start"

echo.
echo ✅ Both servers are starting...
echo.
echo 🌐 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:5000
echo.
echo 📋 Admin access: http://localhost:3000/admin/login
echo.
echo Press any key to close this window...
pause >nul
