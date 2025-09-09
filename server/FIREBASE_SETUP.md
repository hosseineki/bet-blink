# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "betblink-api")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 3: Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 4: Get Web App Configuration

1. Go to Project Settings (gear icon) → General
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) icon
4. Enter app nickname (e.g., "betblink-server")
5. Click "Register app"
6. Copy the configuration object

## Step 5: Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update your `.env` file with the values from the Firebase config:

   ```env
   FIREBASE_API_KEY=your-api-key
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

## Step 5: Set Up Firestore Security Rules

1. Go to Firestore Database → Rules
2. Replace the default rules with:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Games are publicly readable
       match /games/{gameId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       
       // Game results are readable by the user who created them
       match /gameResults/{resultId} {
         allow read, write: if request.auth != null && 
           resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

## Step 6: Test the Connection

1. Start the server:
   ```bash
   bun run dev
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:3001/api/health
   ```

3. Test registration (replace with your actual data):
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "User",
       "phoneNumber": "+1234567890",
       "email": "test@example.com",
       "password": "password123",
       "confirmPassword": "password123",
       "dateOfBirth": "1990-01-01",
       "address": {
         "street": "123 Test St",
         "city": "Test City",
         "state": "TS",
         "postCode": "12345",
         "country": "United States"
       },
       "paymentMethod": {
         "type": "card",
         "cardNumber": "1234567890123456",
         "expiryDate": "12/25",
         "cvv": "123",
         "cardholderName": "Test User"
       },
       "termsAccepted": true,
       "marketingConsent": false
     }'
   ```

## Troubleshooting

### "Invalid PEM formatted message" Error

This usually means the private key format is incorrect. Make sure:

1. The private key is wrapped in quotes in your `.env` file
2. The private key contains actual newlines, not `\n` characters
3. The private key starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`

### "Project not found" Error

1. Verify your `FIREBASE_PROJECT_ID` matches your Firebase project ID exactly
2. Make sure the project exists and you have access to it
3. Check that the service account has the correct permissions

### "Permission denied" Error

1. Check your Firestore security rules
2. Make sure the service account has the necessary permissions
3. Verify the database is created and accessible

## Security Best Practices

1. **Never commit** your `.env` file or service account JSON to version control
2. **Use environment-specific** Firebase projects for development, staging, and production
3. **Rotate service account keys** regularly
4. **Use least privilege** principle for Firestore security rules
5. **Monitor** your Firebase usage and set up billing alerts

## Production Deployment

For production:

1. Use environment variables in your deployment platform
2. Set up proper Firestore security rules
3. Enable Firebase App Check for additional security
4. Monitor your Firebase usage and costs
5. Set up proper logging and monitoring
