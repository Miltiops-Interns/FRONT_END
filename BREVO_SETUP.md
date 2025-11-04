# Brevo Email Integration Setup Guide

This project uses **Brevo Transactional Emails API** for sending emails when users submit contact forms, reservations, and orders.

## 🎯 Quick Start

Add these variables to your `.env` file:

```env
# Brevo API Configuration (REQUIRED)
BREVO_API_KEY=xkeysib-your_actual_api_key
EMAIL_FROM=your_verified_sender@yourdomain.com
ADMIN_EMAIL=where_you_want_notifications@gmail.com
```

**Important:**
- `BREVO_API_KEY` must be an **API key** starting with `xkeysib-` (NOT an SMTP key)
- Get this from: Brevo Dashboard → Profile → SMTP & API → API Keys
- **CRITICAL**: When generating the API key, you MUST enable **"Transactional Emails"** permission!
- `EMAIL_FROM` must be a **verified sender** in Brevo
- `ADMIN_EMAIL` is where all notifications will be sent

## 📋 How to Get Your Credentials

### Getting API Credentials:

1. Log in to [Brevo](https://app.brevo.com)
2. Go to **Profile** → **SMTP & API** → **API Keys** tab
3. Click **Generate a new API key**
4. Name it (e.g., "Restaurant App")
5. **CRITICAL**: When prompted for permissions, check the box for **"Transactional Emails"** - THIS IS REQUIRED!
6. Copy the API key (starts with `xkeysib-`)
7. If you get "Forbidden" errors, regenerate the key with proper permissions

### Verifying Your Sender:

1. Log in to [Brevo](https://app.brevo.com)
2. Go to **Senders & IP** → **Senders** tab
3. Add your sender email address
4. Verify it by clicking the verification link sent to that email
5. Use this verified email as `EMAIL_FROM`

## 🧪 Testing

Once configured, test your setup:

```bash
# Start the backend server
node backend/server.js

# In another terminal, test email sending
curl http://localhost:5000/test-email
```

The service uses Brevo Transactional Emails API exclusively.

## 📧 Supported Email Types

The system sends beautifully formatted HTML emails for:

- **Contact Messages**: New contact form submissions
- **Reservations**: Table reservation requests
- **Orders**: New food orders received

All emails are sent to the `ADMIN_EMAIL` address specified in your `.env`.

## 🐛 Troubleshooting

### "Forbidden" error (HTTP 403)

- **Most common issue**: Your API key doesn't have "Transactional Emails" permission enabled
- **Solution**: Generate a new API key in Brevo and **ensure you check "Transactional Emails" permission**
- If you already have a key, delete it and create a new one with proper permissions
- **Also check**: Your Brevo account may need activation - contact Brevo support if needed

### "Unauthorized" error (HTTP 401)

- Your API key is invalid or has been deleted
- Regenerate the API key from your Brevo dashboard
- Ensure the key starts with `xkeysib-`

### "Bad Request" or sender not verified

- Ensure `EMAIL_FROM` is a **verified sender** in Brevo
- Verify the sender email in Brevo Dashboard → **Senders & IP** → **Senders**

### Account activation required

- If you see: "Your SMTP account is not yet activated"
- This means your Brevo account needs activation for email sending
- Contact Brevo support at contact@brevo.com to request activation
- This applies even when using the API (the error message is misleading)

## 📚 Additional Resources

- [Brevo Transactional API Documentation](https://developers.brevo.com/docs/send-emails-with-the-transactional-api)
- [Brevo Dashboard](https://app.brevo.com)
- [Brevo Support](mailto:contact@brevo.com)
