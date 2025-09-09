#!/usr/bin/env node

/**
 * Script to test Firebase configuration
 * Usage: node scripts/test-firebase.js
 */

require('dotenv').config();

console.log('🧪 Testing Firebase Configuration');
console.log('==================================');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('FIREBASE_STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing');
console.log('FIREBASE_MESSAGING_SENDER_ID:', process.env.FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing');
console.log('FIREBASE_APP_ID:', process.env.FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');

const requiredKeys = ['FIREBASE_API_KEY', 'FIREBASE_PROJECT_ID', 'FIREBASE_STORAGE_BUCKET', 'FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_APP_ID'];
const missingKeys = requiredKeys.filter(key => !process.env[key]);

if (missingKeys.length > 0) {
  console.log('');
  console.log('❌ Missing required environment variables!');
  console.log('Missing keys:', missingKeys.join(', '));
  console.log('Please check your .env file and make sure all Firebase Web SDK variables are set.');
  process.exit(1);
}

// Test Firebase configuration format
console.log('');
console.log('🔍 Testing Firebase Configuration Format:');

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

console.log('API Key format:', config.apiKey?.length > 20 ? '✅' : '❌');
console.log('Project ID format:', config.projectId?.includes('-') ? '✅' : '❌');
console.log('Storage Bucket format:', config.storageBucket?.includes('.appspot.com') ? '✅' : '❌');
console.log('Messaging Sender ID format:', /^\d+$/.test(config.messagingSenderId || '') ? '✅' : '❌');
console.log('App ID format:', config.appId?.includes(':') ? '✅' : '❌');

// Test Firebase initialization
console.log('');
console.log('🔥 Testing Firebase Initialization:');

try {
  const { initializeApp } = require('firebase/app');

  const app = initializeApp(config);

  console.log('✅ Firebase Web SDK initialized successfully!');
  console.log('✅ Configuration is valid and ready to use.');

} catch (error) {
  console.log('❌ Firebase initialization failed:');
  console.log('Error:', error.message);
  console.log('');
  console.log('💡 Common solutions:');
  console.log('1. Check that all Firebase configuration values are correct');
  console.log('2. Verify your Firebase project is properly set up');
  console.log('3. Make sure all environment variables are set correctly');
  console.log('4. Check the Firebase Console for the correct configuration values');
  process.exit(1);
}
