// Test script for email notifications
// Run with: node testEmail.js

const { sendNotificationEmail } = require('./utils/emailService');

async function testEmails() {
  console.log('Testing email notifications...\n');

  // Test contact message
  console.log('1. Testing contact message notification...');
  const contactResult = await sendNotificationEmail('contact', {
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    message: 'This is a test contact message from the admin.'
  });
  console.log('Contact result:', contactResult);

  // Test reservation
  console.log('\n2. Testing reservation notification...');
  const reservationResult = await sendNotificationEmail('reservation', {
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '987-654-3210',
    date: new Date(),
    time: '7:00 PM',
    guests: 4,
    specialRequests: 'Window seat please'
  });
  console.log('Reservation result:', reservationResult);

  // Test order
  console.log('\n3. Testing order notification...');
  const orderResult = await sendNotificationEmail('order', {
    customerName: 'Test Buyer',
    phone: '555-123-4567',
    whatsapp: '555-123-4567',
    items: [
      { id: '1', name: 'Burger', price: 15.99, quantity: 2 },
      { id: '2', name: 'Fries', price: 5.99, quantity: 1 }
    ],
    totalPrice: 37.97
  });
  console.log('Order result:', orderResult);

  console.log('\nEmail testing completed. Check your admin email for notifications.');
}

testEmails().catch(console.error);