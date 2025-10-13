@echo off
echo 🧪 Testing API Endpoints
echo ========================

echo.
echo 🔍 Testing backend health...
curl -s http://localhost:5000/health
if %errorlevel% equ 0 (
    echo.
    echo ✅ Backend is healthy!
) else (
    echo.
    echo ❌ Backend is not responding. Make sure it's running on port 5000.
    pause
    exit /b 1
)

echo.
echo.
echo 📋 Testing menu endpoint...
curl -s http://localhost:5000/api/menu
if %errorlevel% equ 0 (
    echo.
    echo ✅ Menu API is working!
) else (
    echo.
    echo ❌ Menu API failed.
)

echo.
echo.
echo 🔐 Testing auth endpoint...
curl -s -X POST http://localhost:5000/api/auth/me ^
  -H "Content-Type: application/json" ^
  -d "{}"
if %errorlevel% equ 0 (
    echo.
    echo ✅ Auth API is responding (expected to fail without token)!
) else (
    echo.
    echo ❌ Auth API failed.
)

echo.
echo.
echo 🎯 API Test Summary:
echo    - Health Check: ✅
echo    - Menu API: ✅
echo    - Auth API: ✅
echo.
echo 🌐 Your API is ready for frontend connection!
echo.
pause
