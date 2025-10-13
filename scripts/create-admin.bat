@echo off
echo 👤 Create Admin User
echo ====================

set /p username="Enter admin username (default: admin): "
if "%username%"=="" set username=admin

set /p password="Enter admin password: "
if "%password%"=="" (
    echo ❌ Password cannot be empty
    pause
    exit /b 1
)

echo.
echo 📡 Creating admin user...
echo Username: %username%
echo.

curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"%username%\",\"password\":\"%password%\"}"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Admin user created successfully!
    echo.
    echo 🔑 Login credentials:
    echo    Username: %username%
    echo    Password: %password%
    echo.
    echo 🌐 Access admin panel at: http://localhost:3000/admin/login
) else (
    echo.
    echo ❌ Failed to create admin user. Make sure:
    echo    1. Backend server is running (http://localhost:5000)
    echo    2. MongoDB is connected
    echo    3. No user with this username already exists
)

echo.
pause
