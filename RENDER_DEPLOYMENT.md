# 🚀 Complete Render.com Deployment Guide

This guide will walk you through deploying your backend on Render.com and then connecting your frontend (hosted on Hostinger) to it.

---

## 📋 Part 1: Deploy Backend on Render.com

### Step 1: Prepare Your Repository

1. **Make sure your code is pushed to GitHub:**
   - Your repository should have the `backend/` folder with all your files
   - Ensure all files are committed and pushed

2. **Verify your backend structure:**
   ```
   backend/
   ├── server.js
   ├── package.json
   ├── routes/
   ├── models/
   ├── utils/
   └── middleware/
   ```

### Step 2: Create Render Account

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login** (you can use GitHub to sign up)
3. **Verify your email** if required

### Step 3: Create New Web Service

1. **Click "New +" button** (top right)
2. **Select "Web Service"**
3. **Connect your GitHub repository:**
   - If first time, click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select the repository containing your restaurant app

### Step 4: Configure the Web Service

Fill in the following details:

- **Name:** `restaurant-backend` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Choose `Free` (or paid if you need)

### Step 5: Set Environment Variables

Click on **"Environment"** tab and add these variables one by one:

#### Required Environment Variables:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_strong_random_secret_key_here
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=your_admin_email@example.com
DEBUG_EMAIL=false
```

#### Detailed Explanation:

1. **NODE_ENV**
   - Value: `production`
   - Purpose: Sets Node.js environment to production mode

2. **PORT**
   - Value: `10000` (or leave empty - Render will auto-assign)
   - Purpose: Port for the server (Render provides PORT automatically, but you can set it)

3. **MONGO_URI**
   - Value: Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - ⚠️ **Important:** Replace `@` with `%40` if password contains special characters
   - Example: `mongodb+srv://user:pass%40123@cluster.mongodb.net/restaurant?retryWrites=true&w=majority`

4. **JWT_SECRET**
   - Value: A strong random string (at least 32 characters)
   - Generate one using: `openssl rand -base64 32` or use an online generator
   - Example: `my-super-secret-jwt-key-1234567890-abcdefghijklmnop`

5. **RESEND_API_KEY**
   - Value: Your Resend API key (starts with `re_`)
   - Get it from: [Resend Dashboard](https://resend.com/api-keys)
   - Format: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

6. **EMAIL_FROM**
   - Value: `onboarding@resend.dev` (for testing) or your verified domain email
   - ⚠️ **Note:** Without domain verification, you can only send to your Resend account owner email
   - For production: Use a verified domain email like `noreply@yourdomain.com`

7. **ADMIN_EMAIL**
   - Value: Email where you want to receive notifications
   - Example: `admin@yourdomain.com` or `your-email@gmail.com`
   - ⚠️ **Important:** If using `onboarding@resend.dev`, this must match your Resend account owner email

8. **DEBUG_EMAIL**
   - Value: `false` (or `true` for verbose logging)
   - Purpose: Enable/disable detailed email logging

### Step 6: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-5 minutes)
   - You'll see build logs in real-time
   - Watch for any errors

3. **Check deployment status:**
   - Green checkmark = Success ✅
   - Red X = Failed ❌ (check logs)

### Step 7: Get Your Backend URL

1. **Once deployed, you'll see a URL like:**
   ```
   https://restaurant-backend-xxxx.onrender.com
   ```

2. **Copy this URL** - This is your backend API URL

3. **Test your backend:**
   - Visit: `https://your-backend-url.onrender.com/test-env`
   - Should return JSON with environment variables status

4. **Test API endpoint:**
   - Visit: `https://your-backend-url.onrender.com/api/menu`
   - Should return menu items (or empty array)

---

## 📋 Part 2: Update Frontend to Use Render Backend

### Step 1: Create Environment File

1. **In your project root** (not in `backend/`), create `.env.production` file:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**Replace `your-backend-url.onrender.com` with your actual Render backend URL**

Example:
```env
REACT_APP_API_URL=https://restaurant-backend-xxxx.onrender.com
```

### Step 2: Update CORS (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000' // For local testing
  ],
  credentials: true
}));
```

Then **redeploy on Render** (Render auto-deploys on git push, or manually click "Manual Deploy")

### Step 3: Test Locally

1. **Create `.env` file in project root** (for local development):
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

2. **Start frontend:**
   ```bash
   npm start
   ```

3. **Test all features:**
   - Home page
   - Menu page
   - Contact form
   - Reservations
   - Admin login

4. **Check browser console** (F12) for any errors

---

## 📋 Part 3: Build Frontend for Production

### Step 1: Build React App

1. **Open terminal in project root**

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Ensure `.env.production` exists** with your Render backend URL:
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

4. **Build the production version:**
   ```bash
   npm run build
   ```

5. **Wait for build to complete**
   - This creates a `build/` folder with optimized files
   - Build usually takes 1-3 minutes

6. **Verify the build folder:**
   - Check that `build/` folder contains:
     - `index.html`
     - `static/` folder (with CSS, JS files)
     - All your images and assets

---

## 📋 Part 4: Deploy Frontend on Hostinger

### Method 1: Using Hostinger cPanel File Manager

1. **Login to Hostinger:**
   - Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Login with your credentials

2. **Access File Manager:**
   - In hPanel, find "File Manager"
   - Navigate to `public_html` folder (this is your website root)

3. **Backup existing files** (if any):
   - Select all files in `public_html`
   - Right-click → "Compress" → Create a backup ZIP

4. **Delete old files** (if any):
   - Select all files in `public_html`
   - Click "Delete" (keep the folder structure)

5. **Upload build files:**
   - Go to your local `build/` folder
   - **Select ALL files and folders inside `build/`** (not the `build/` folder itself)
   - Upload them to `public_html`
   - Wait for upload to complete

6. **Create `.htaccess` file:**
   - In `public_html`, click "New File"
   - Name it: `.htaccess`
   - Add this content:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QR,L]
   ```
   - Save the file

7. **Set file permissions:**
   - Select all files
   - Right-click → "Change Permissions"
   - Set to: `644` for files, `755` for folders

### Method 2: Using FTP Client (FileZilla, WinSCP, etc.)

1. **Get FTP credentials from Hostinger:**
   - In hPanel → "FTP Accounts"
   - Note down:
     - **FTP Server:** (e.g., `ftp.yourdomain.com`)
     - **Username:** (your FTP username)
     - **Password:** (your FTP password)
     - **Port:** `21` (usually)

2. **Connect using FTP client:**
   - Open FileZilla (or your preferred FTP client)
   - Enter credentials:
     - Host: `ftp.yourdomain.com`
     - Username: `your-ftp-username`
     - Password: `your-ftp-password`
     - Port: `21`
   - Click "Quickconnect"

3. **Navigate to `public_html` folder**

4. **Delete old files** (if any):
   - Select all files in `public_html`
   - Delete them

5. **Upload build folder contents:**
   - Go to your local `build/` folder
   - Select ALL files and folders inside `build/`
   - Drag and drop to `public_html` on server
   - Wait for upload to complete

6. **Create `.htaccess` file:**
   - Right-click in `public_html` → "Create new file"
   - Name: `.htaccess`
   - Add the same content as Method 1
   - Save

---

## 📋 Part 5: Post-Deployment Verification

### 1. Test Your Website

1. **Visit your domain:**
   - Example: `https://yourdomain.com`
   - Test all pages:
     - ✅ Home page loads
     - ✅ Menu page works
     - ✅ Contact form submits
     - ✅ Reservations work
     - ✅ Admin login works

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to "Console" tab
   - Check for any errors
   - Verify API calls are going to Render backend

3. **Test API Connection:**
   - Open "Network" tab in DevTools
   - Submit a contact form
   - Check if request goes to: `https://your-backend-url.onrender.com/api/contact`

### 2. Test Admin Features

1. **Login to admin:**
   - Go to: `https://yourdomain.com/admin/login`
   - Login with admin credentials
   - Test all admin pages:
     - Dashboard
     - Menu management
     - Reservations
     - Contact messages
     - Orders

### 3. Monitor Render Dashboard

1. **Check Render logs:**
   - Go to Render dashboard
   - Click on your service
   - Check "Logs" tab for any errors

2. **Monitor metrics:**
   - Check CPU, Memory usage
   - Check request logs

---

## 🔧 Troubleshooting

### Backend Issues on Render:

#### Build Fails:
- **Check build logs** in Render dashboard
- **Verify `package.json`** has correct start script
- **Check Root Directory** is set to `backend`
- **Verify all dependencies** are in `package.json`

#### Server Crashes:
- **Check logs** in Render dashboard
- **Verify all environment variables** are set correctly
- **Check MongoDB connection string** format
- **Test MongoDB connection** from your local machine

#### API Returns 500 Errors:
- **Check Render logs** for detailed error messages
- **Test backend directly:** `https://your-backend.onrender.com/test-env`
- **Verify environment variables** are correct

#### CORS Errors:
- **Update `backend/server.js`** to include your frontend domain:
  ```javascript
  app.use(cors({
    origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
    credentials: true
  }));
  ```
- **Redeploy on Render**

### Frontend Issues on Hostinger:

#### 404 Errors on Routes:
- **Check `.htaccess` file** exists and has correct content
- **Verify file permissions** (should be 644)
- **Check file paths** in browser console

#### API Calls Fail:
- **Verify `REACT_APP_API_URL`** was set before building
- **Check browser console** for CORS errors
- **Verify backend URL** is correct in built files
- **Rebuild frontend** if you changed the URL

#### Static Files Not Loading:
- **Check file paths** in `build/index.html`
- **Verify all files uploaded** correctly
- **Check file permissions** (644 for files, 755 for folders)
- **Clear browser cache** and hard refresh (Ctrl+F5)

#### White Screen / Blank Page:
- **Check browser console** for errors
- **Verify `index.html`** exists in `public_html`
- **Check if API calls are failing** (might block rendering)
- **Verify all JavaScript files** are loading

---

## 📝 Complete Environment Variables Checklist

### Backend (Render.com):

- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (optional - Render auto-assigns)
- [ ] `MONGO_URI=your_mongodb_connection_string`
- [ ] `JWT_SECRET=your_strong_secret_key`
- [ ] `RESEND_API_KEY=re_your_api_key`
- [ ] `EMAIL_FROM=onboarding@resend.dev` (or verified domain email)
- [ ] `ADMIN_EMAIL=your_admin_email@example.com`
- [ ] `DEBUG_EMAIL=false`

### Frontend (Build-time):

- [ ] `.env.production` file with `REACT_APP_API_URL=https://your-backend-url.onrender.com`

---

## 🎯 Quick Reference

### Your URLs:
- **Backend API:** `https://your-backend-url.onrender.com`
- **Frontend:** `https://yourdomain.com`

### Important Files:
- **Backend Root:** `backend/` folder
- **Frontend Build:** `build/` folder (upload contents to Hostinger)
- **Environment:** `.env.production` in project root

### Render Dashboard:
- **URL:** [dashboard.render.com](https://dashboard.render.com)
- **Logs:** Service → Logs tab
- **Environment:** Service → Environment tab

---

## 🎉 Success Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] All environment variables set in Render
- [ ] Backend tested (`/test-env` endpoint works)
- [ ] `.env.production` created with backend URL
- [ ] Frontend built successfully (`npm run build`)
- [ ] Build files uploaded to Hostinger
- [ ] `.htaccess` file created on Hostinger
- [ ] Website loads correctly
- [ ] All features tested and working
- [ ] Admin login works
- [ ] API calls going to Render backend

---

## 🆘 Need Help?

1. **Check Render logs** for backend errors
2. **Check browser console** for frontend errors
3. **Verify all environment variables** are set correctly
4. **Test backend directly** using the test endpoints
5. **Check CORS settings** if API calls fail

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Hostinger Help Center](https://www.hostinger.com/tutorials)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Resend Setup Guide](./RESEND_SETUP.md)

---

**🎊 Congratulations! Your restaurant app should now be live!**

Your backend is running on Render and your frontend is hosted on Hostinger, all connected and working together! 🚀

