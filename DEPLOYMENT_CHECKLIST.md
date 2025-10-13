# ✅ Deployment Checklist

Quick checklist to ensure successful deployment of your Hotel Website.

---

## 📋 Pre-Deployment Checklist

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free tier cluster created (M0)
- [ ] Database user created with username and password
- [ ] Network Access configured (Allow 0.0.0.0/0)
- [ ] Connection string copied and tested
- [ ] Database name added to connection string (`/restaurant-app`)

### GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Latest changes committed
- [ ] No sensitive data in commits (.env files not committed)
- [ ] Repository is accessible (public or connected to Render)

### Gmail Setup (for email notifications)
- [ ] 2-Step Verification enabled in Gmail
- [ ] App Password generated
- [ ] App Password saved securely

### Local Testing
- [ ] Application works locally with MongoDB Atlas
- [ ] All features tested (menu, cart, contact, reservations)
- [ ] Admin login works
- [ ] No console errors

---

## 🚀 Backend Deployment Checklist

### Render Backend Web Service
- [ ] New Web Service created on Render
- [ ] GitHub repository connected
- [ ] Branch set to `main`
- [ ] Root directory set to `backend`
- [ ] Runtime set to `Node`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Instance type: Free (or paid)

### Environment Variables Set
- [ ] `MONGO_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong random string (32+ chars)
- [ ] `PORT` - `5000`
- [ ] `NODE_ENV` - `production`
- [ ] `EMAIL_HOST` - `smtp.gmail.com`
- [ ] `EMAIL_PORT` - `587`
- [ ] `EMAIL_USER` - Your Gmail address
- [ ] `EMAIL_PASS` - Gmail App Password
- [ ] `ADMIN_EMAIL` - Admin notification email
- [ ] `FRONTEND_URL` - Will add after frontend deployment

### Backend Verification
- [ ] Deployment completed successfully
- [ ] No error logs in Render dashboard
- [ ] Backend URL copied (e.g., `https://hotel-backend.onrender.com`)
- [ ] Health check endpoint works: `https://your-backend.onrender.com/health`
- [ ] Response shows: `status: "OK"` and `database: "Connected"`
- [ ] Menu API works: `https://your-backend.onrender.com/api/menu`

---

## 🎨 Frontend Deployment Checklist

### Render Frontend Static Site
- [ ] New Static Site created on Render
- [ ] GitHub repository connected
- [ ] Branch set to `main`
- [ ] Root directory left empty (uses repo root)
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `build`

### Environment Variable Set
- [ ] `REACT_APP_API_URL` - Backend URL from previous step

### Frontend Verification
- [ ] Build completed successfully
- [ ] No build errors in logs
- [ ] Frontend URL copied (e.g., `https://hotel-frontend.onrender.com`)
- [ ] Website loads in browser
- [ ] No 404 errors
- [ ] No console errors

---

## 🔄 Post-Deployment Configuration

### Update Backend CORS
- [ ] Go to backend Web Service settings
- [ ] Edit `FRONTEND_URL` environment variable
- [ ] Set to your frontend URL: `https://your-frontend.onrender.com`
- [ ] Save changes (triggers redeploy)
- [ ] Wait for backend to redeploy (5-10 mins)
- [ ] Verify health check still works

### Create Admin User
- [ ] Use curl, Postman, or Insomnia
- [ ] POST to `https://your-backend.onrender.com/api/auth/register`
- [ ] Send JSON: `{"username":"admin","password":"yourpassword"}`
- [ ] Receive success response
- [ ] Save admin credentials securely

---

## 🧪 Testing Checklist

### Homepage Tests
- [ ] Homepage loads correctly
- [ ] Images display
- [ ] Navigation works
- [ ] Hero section visible
- [ ] Features section displays
- [ ] Restaurant 3D scene loads (if applicable)
- [ ] Footer displays

### Menu Page Tests
- [ ] Menu page loads
- [ ] Menu categories display
- [ ] Menu items show with images and prices
- [ ] Add to cart buttons work
- [ ] Cart icon updates
- [ ] Can navigate to cart page

### Cart Page Tests
- [ ] Cart displays items
- [ ] Quantity adjustment works
- [ ] Remove item works
- [ ] Total calculates correctly
- [ ] Checkout modal opens
- [ ] Can submit order with customer details
- [ ] Success message appears

### Contact Page Tests
- [ ] Contact form displays
- [ ] All fields work
- [ ] Form validation works
- [ ] Submit button sends data
- [ ] Success/error message displays
- [ ] Google Maps embed loads

### Reservation Tests
- [ ] Reservation modal opens
- [ ] Form fields work
- [ ] Date picker works
- [ ] Time selection works
- [ ] Guest number selection works
- [ ] Submit button works
- [ ] Success message appears

### Admin Dashboard Tests
- [ ] Admin login page loads at `/admin/login`
- [ ] Can login with created credentials
- [ ] Redirects to dashboard on success
- [ ] Dashboard shows counts (messages, reservations, orders)
- [ ] Navigation buttons work
- [ ] Logout works

### Admin Menu Management Tests
- [ ] Menu management page loads
- [ ] Existing items display
- [ ] Can add new menu item
- [ ] Can edit menu item
- [ ] Can delete menu item
- [ ] Changes reflect on public menu page

### Admin Reservations Tests
- [ ] Reservations page loads
- [ ] Shows submitted reservations
- [ ] Can update reservation status
- [ ] Can delete reservation
- [ ] Status changes persist

### Admin Orders Tests
- [ ] Orders page loads
- [ ] Shows submitted orders
- [ ] Displays order details
- [ ] Can update order status
- [ ] WhatsApp button generates correct link

### Admin Messages Tests
- [ ] Messages page loads
- [ ] Shows contact form submissions
- [ ] Displays message details
- [ ] Can delete messages

### Email Notification Tests (if configured)
- [ ] Submit contact form
- [ ] Check admin email for notification
- [ ] Submit reservation
- [ ] Check admin email for notification
- [ ] Submit order
- [ ] Check admin email for notification

---

## 🔒 Security Verification

- [ ] `.env` files not committed to Git
- [ ] JWT_SECRET is strong and unique
- [ ] Gmail App Password used (not main password)
- [ ] MongoDB Atlas credentials secure
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Render)
- [ ] No API keys or secrets visible in client-side code
- [ ] Admin routes require authentication

---

## 📊 Monitoring Setup

### Render Dashboard
- [ ] Checked backend logs (no errors)
- [ ] Checked frontend build logs (no errors)
- [ ] Set up email alerts for service issues (optional)
- [ ] Bookmarked dashboard URLs

### MongoDB Atlas
- [ ] Checked cluster metrics
- [ ] Verified connections
- [ ] Checked database size
- [ ] Set up alerts for storage limits (optional)

---

## 🎯 Performance Checks

- [ ] Page load time is acceptable (< 3 seconds)
- [ ] Images load properly
- [ ] No broken links
- [ ] Mobile responsive (test on phone)
- [ ] Works on different browsers (Chrome, Firefox, Safari)
- [ ] API responses are fast (< 1 second)

---

## 📱 Mobile Testing

- [ ] Test on mobile browser
- [ ] Navigation menu works on mobile
- [ ] Forms are usable on mobile
- [ ] Cart functionality works
- [ ] Admin dashboard works on mobile
- [ ] All pages responsive

---

## 🌐 Optional Enhancements

- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified
- [ ] Google Analytics added (optional)
- [ ] SEO optimization (optional)
- [ ] Social media integration (optional)

---

## 📝 Documentation

- [ ] README.md updated with live URLs
- [ ] Admin credentials documented securely
- [ ] MongoDB Atlas credentials saved
- [ ] Render account details saved
- [ ] Email settings documented
- [ ] API documentation created (if needed)

---

## 🎉 Launch Checklist

- [ ] All tests passing
- [ ] No critical errors
- [ ] Admin can access dashboard
- [ ] Users can place orders
- [ ] Contact form working
- [ ] Email notifications working
- [ ] Performance is acceptable
- [ ] Mobile experience is good

---

## ✅ Post-Launch

- [ ] Share website URL with stakeholders
- [ ] Add first batch of menu items
- [ ] Test with real users
- [ ] Monitor for issues
- [ ] Set up regular backups (MongoDB Atlas)
- [ ] Plan for scaling if needed

---

## 🆘 Troubleshooting Quick Reference

| Issue | Check |
|-------|-------|
| Backend won't start | Check environment variables, MongoDB connection |
| Frontend shows errors | Check REACT_APP_API_URL, backend health |
| CORS errors | Verify FRONTEND_URL in backend matches frontend URL |
| Database connection fails | Check MongoDB Atlas IP whitelist, credentials |
| Email not sending | Verify Gmail App Password, EMAIL_* variables |
| Admin can't login | Ensure admin user created, JWT_SECRET set |
| 404 errors | Check routes, build logs |
| Slow performance | Check Render free tier limitations |

---

## 📞 Support Resources

- **Deployment Guide**: See DEPLOYMENT.md
- **Setup Guide**: See SETUP.md  
- **Environment Variables**: See ENVIRONMENT_VARIABLES.md
- **Summary**: See DEPLOYMENT_SUMMARY.md
- **Render Docs**: https://render.com/docs
- **MongoDB Docs**: https://docs.atlas.mongodb.com/

---

## 🎊 Congratulations!

If you've checked all items above, your Hotel Website is successfully deployed and ready for production use! 🚀

**Your website is now accessible from anywhere in the world!**

Share your URL: `https://your-frontend.onrender.com`

