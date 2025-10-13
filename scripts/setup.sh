#!/bin/bash

# Hotel Website Setup Script
# This script helps set up the development environment

echo "🏨 Hotel Website Setup Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Check if .env files exist
echo ""
echo "🔧 Checking environment files..."

if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env file not found. Creating from template..."
    cp env.example .env
    echo "✅ Created .env file. Please edit it with your configuration."
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from template..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file. Please edit it with your configuration."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your MongoDB Atlas credentials"
echo "2. Edit .env with your backend URL"
echo "3. Start the backend: cd backend && npm start"
echo "4. Start the frontend: npm start"
echo "5. Create admin user using the API"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - SETUP.md for local development"
echo "   - DEPLOYMENT.md for production deployment"
echo ""
echo "🚀 Happy coding!"
