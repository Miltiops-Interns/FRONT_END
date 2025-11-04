# Resend Email Integration Setup Guide

This project uses **Resend Transactional Email API** for sending emails when users submit contact forms, reservations, and orders.

## ✅ Current Status

**Integration Complete!** All code is configured and working with Resend API.

**Current Configuration:**
- **API Key**: Configured ✅
- **From Address**: `onboarding@resend.dev` (Resend test domain)
- **To Address**: `abhimultiops001@gmail.com` (your Resend account owner email)

## 🎯 Quick Setup

Add these variables to your `.env` file:

```env
# Resend API Configuration (REQUIRED)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=abhimultiops001@gmail.com
```

**Important:**
- `RESEND_API_KEY` must start with `re_`
- `EMAIL_FROM` using `onboarding@resend.dev` works without domain verification
- Without domain verification, you can **only send to your account owner email**

## 🐛 Troubleshooting: Emails Showing "Failed" in Dashboard

If you see emails with "Failed" status in your Resend dashboard:

### Step 1: Check the Error Message
1. Click on a **failed email** in the Resend dashboard
2. Look for the error message/details
3. Common errors include:
   - Domain not verified
   - Email content validation issues
   - Spam filter triggers
   - Invalid recipient

### Step 2: Verify Your Setup
1. **Check API Key**: Ensure `RESEND_API_KEY` starts with `re_`
2. **Check Sender**: `EMAIL_FROM` should be `onboarding@resend.dev` for testing
3. **Check Recipient**: `ADMIN_EMAIL` must match your Resend account owner email

### Step 3: Test with Simple Email
```bash
# Test with simple email
curl http://localhost:5000/test-resend
```

### Step 4: Verify Domain (For Production)
To send to any email address:
1. Go to https://resend.com/domains
2. Add and verify your domain
3. Update `EMAIL_FROM` to use your verified domain (e.g., `noreply@yourdomain.com`)
4. Update `ADMIN_EMAIL` to your desired recipient

## 📧 Supported Email Types

The system sends beautifully formatted HTML emails for:

- **Contact Messages**: New contact form submissions
- **Reservations**: Table reservation requests  
- **Orders**: New food orders received

All emails are sent to the `ADMIN_EMAIL` address.

## 🧪 Testing

```bash
# Start the backend server
node backend/server.js

# Test endpoints:
curl http://localhost:5000/test-resend      # Simple test email
curl http://localhost:5000/test-email      # Full formatted contact email
```

## 📚 Additional Resources

- [Resend Dashboard](https://resend.com/emails) - View email status and errors
- [Resend Domains](https://resend.com/domains) - Verify your domain
- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)

