// Add this to your server.js file to test emails from production
const express = require('express');
const { sendNotificationEmail } = require('./utils/emailService');

// Test email endpoint (add this to your routes)
app.get('/api/test-email', async (req, res) => {
  try {
    console.log('🧪 Testing email from production...');
    
    const result = await sendNotificationEmail('contact', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      message: 'This is a test email from production backend'
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully!',
        messageId: result.messageId 
      });
    } else {
      res.json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
