# 🚀 Deployment Guide for Restaurant App

This guide will help you deploy your backend on Render and frontend on Hostinger.

---

## 📋 Part 1: Deploy Backend on Render

### Step 1: Prepare Your Backend for Render

1. **Make sure your backend folder structure is correct:**
   ```
   backend/
   ├── server.js
   ├── package.json
   ├── routes/
   ├── models/
   ├── utils/
   └── middleware/
   ```

2. **Your `server.js` already uses `process.env.PORT`** ✅ (Render provides this automatically)

### Step 2: Create Render Account and Deploy

1. **Go to [Render.com](https://render.com)** and sign up/login

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your project

3. **Configure the Service:**
   - **Name:** `restaurant-backend` (or any name you prefer)
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** Leave empty or set to `backend` if needed

4. **Set Environment Variables:**
   Click "Environment" tab and add these variables:
   
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=your_verified_email@yourdomain.com
   ADMIN_EMAIL=your_admin_email@example.com
   DEBUG_EMAIL=false
   ```

   **Important Notes:**
   - `MONGO_URI`: Use your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong random string
   - `RESEND_API_KEY`: Your Resend API key (starts with `re_`)
   - `EMAIL_FROM`: Must be a verified domain email in Resend
   - `ADMIN_EMAIL`: Email where you want to receive notifications

5. **Click "Create Web Service"**
   - Render will start building and deploying your backend
   - Wait for the build to complete (usually 2-5 minutes)
   - Once deployed, you'll get a URL like: `https://restaurant-backend.onrender.com`

6. **Copy Your Backend URL:**
   - After deployment, copy the URL from Render dashboard
   - Example: `https://restaurant-backend-xxxx.onrender.com`
   - This is your backend API URL

---

## 📋 Part 2: Update Frontend to Use Deployed Backend

### Step 1: Update API Configuration

1. **Create a `.env` file in the root of your project** (if it doesn't exist):
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

2. **Update `src/utils/api.js`** (if needed):
   The current code already supports `REACT_APP_API_URL` environment variable.

### Step 2: Test Locally

1. **Create/Update `.env` file in project root:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

2. **Restart your development server:**
   ```bash
   npm start
   ```

3. **Test API calls** to ensure they're pointing to your Render backend

---

## 📋 Part 3: Build Frontend for Production

### Step 1: Build React App

1. **Open terminal in project root**

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Create `.env.production` file** in project root:
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

4. **Build the production version:**
   ```bash
   npm run build
   ```

5. **Wait for build to complete**
   - This creates a `build/` folder with optimized production files
   - The build folder contains all static files ready for deployment

6. **Verify the build folder:**
   - Check that `build/` folder contains:
     - `index.html`
     - `static/` folder with CSS, JS files
     - All your assets

---

## 📋 Part 4: Deploy Frontend on Hostinger

### Method 1: Using Hostinger cPanel File Manager

1. **Login to Hostinger:**
   - Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Login with your credentials

2. **Access File Manager:**
   - In cPanel, find "File Manager"
   - Navigate to `public_html` folder (this is your website root)

3. **Upload Build Files:**
   - **Option A: Delete old files first** (if any)
     - Select all files in `public_html`
     - Click "Delete"
   
   - **Option B: Upload to subfolder** (if you want to keep other files)
     - Create a folder like `restaurant` in `public_html`
     - Upload files there

4. **Upload your build folder contents:**
   - Go to your local `build/` folder
   - Select ALL files and folders inside `build/`
   - Upload them to `public_html` (or your subfolder)
   - **Important:** Upload the CONTENTS of `build/`, not the `build/` folder itself

5. **Create `.htaccess` file** (for React Router to work):
   - In `public_html`, create a new file named `.htaccess`
   - Add this content:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QR,L]
   ```

6. **Set Environment Variable:**
   - Since you can't use `.env` files in static hosting, you need to update the API URL
   - Open `build/static/js/main.*.js` (or use build-time env var)
   - **Better approach:** Ensure `.env.production` is set before building

### Method 2: Using FTP Client (FileZilla, WinSCP, etc.)

1. **Get FTP credentials from Hostinger:**
   - In cPanel → "FTP Accounts"
   - Note down: FTP Server, Username, Password, Port

2. **Connect using FTP client:**
   - Open FileZilla or your preferred FTP client
   - Enter credentials
   - Connect to server

3. **Navigate to `public_html` folder**

4. **Upload build folder contents:**
   - Delete old files (if any)
   - Upload all files from local `build/` folder to `public_html`

5. **Create `.htaccess` file** (same as Method 1)

---

## 📋 Part 5: Post-Deployment Steps

### 1. Test Your Deployed Website

1. **Visit your Hostinger domain:**
   - Example: `https://yourdomain.com`
   - Test all features:
     - Home page loads
     - Menu page works
     - Contact form submits
     - Reservations work
     - Admin login works

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Check for any errors
   - Verify API calls are going to Render backend

### 2. Update CORS on Render (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

Then redeploy on Render.

### 3. Environment Variables Summary

**Backend (Render):**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `RESEND_API_KEY` - Your Resend API key
- `EMAIL_FROM` - Verified email in Resend
- `ADMIN_EMAIL` - Admin notification email

**Frontend (Build-time):**
- `REACT_APP_API_URL` - Your Render backend URL

---

## 🔧 Troubleshooting

### Backend Issues on Render:

1. **Build fails:**
   - Check build logs in Render dashboard
   - Ensure `package.json` has correct start script
   - Verify all dependencies are listed

2. **Server crashes:**
   - Check logs in Render dashboard
   - Verify all environment variables are set
   - Check MongoDB connection string

3. **API returns errors:**
   - Test backend URL directly: `https://your-backend.onrender.com/test-env`
   - Check Render logs for errors

### Frontend Issues on Hostinger:

1. **404 errors on routes:**
   - Ensure `.htaccess` file is created and uploaded
   - Check file permissions (should be 644)

2. **API calls fail:**
   - Verify `REACT_APP_API_URL` was set before building
   - Check browser console for CORS errors
   - Verify backend URL is correct

3. **Static files not loading:**
   - Check file paths in `build/index.html`
   - Ensure all files uploaded correctly
   - Verify file permissions

---

## 📝 Quick Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Environment variables set in Render
- [ ] `.env.production` created with backend URL
- [ ] Frontend built (`npm run build`)
- [ ] Build files uploaded to Hostinger
- [ ] `.htaccess` file created
- [ ] Website tested and working
- [ ] CORS configured (if needed)

---

## 🎉 You're Done!

Your restaurant app should now be live:
- **Backend:** `https://your-backend.onrender.com`
- **Frontend:** `https://yourdomain.com`

If you encounter any issues, check the Render logs and browser console for errors.

