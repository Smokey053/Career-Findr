# 🚀 Quick Setup Guide

## Step 1: Firebase Setup (5-10 minutes)

### A. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name (e.g., "career-findr")
4. Disable Google Analytics (optional)
5. Click "Create project"

### B. Enable Firestore Database
1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location (e.g., us-central)
5. Click "Enable"

### C. Enable Authentication
1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Click on "Email/Password" in Sign-in method tab
4. Enable it and click "Save"

### D. Get Admin SDK Credentials
1. Go to Project Settings (gear icon) → Service Accounts
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will download
4. **KEEP THIS FILE SECURE - DON'T SHARE IT**

### E. Get Web App Configuration
1. Go to Project Settings (gear icon) → General
2. Scroll to "Your apps" section
3. Click the web icon `</>`
4. Register your app with a nickname
5. Copy the configuration object

## Step 2: Local Setup (2-3 minutes)

### A. Create Environment File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the downloaded JSON file from Step 1.D

3. Update your `.env` file:

   **From the JSON file, copy:**
   - `project_id` → FIREBASE_PROJECT_ID
   - `private_key` → FIREBASE_PRIVATE_KEY (keep the quotes)
   - `client_email` → FIREBASE_CLIENT_EMAIL

   **From the web config (Step 1.E), copy:**
   - `apiKey` → FIREBASE_API_KEY
   - `authDomain` → FIREBASE_AUTH_DOMAIN
   - `storageBucket` → FIREBASE_STORAGE_BUCKET
   - `messagingSenderId` → FIREBASE_MESSAGING_SENDER_ID
   - `appId` → FIREBASE_APP_ID

   **Generate a random JWT secret:**
   ```bash
   # On Windows PowerShell:
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
   
   # Or just use a random string like:
   # JWT_SECRET=mySecretKey123SuperSecure!RandomString456
   ```

### B. Example .env File

```env
# Server
PORT=5000
NODE_ENV=development

# Firebase Admin (from JSON file)
FIREBASE_PROJECT_ID=career-findr-12345
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@career-findr-12345.iam.gserviceaccount.com

# Firebase Client (from web config)
FIREBASE_API_KEY=AIzaSyABC123...
FIREBASE_AUTH_DOMAIN=career-findr-12345.firebaseapp.com
FIREBASE_STORAGE_BUCKET=career-findr-12345.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# JWT
JWT_SECRET=your-super-secret-random-string-here
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

## Step 3: Run the Server (1 minute)

```bash
# Make sure you're in the project directory
cd "c:\Users\lefat\Documents\Web Design\Assignments\Group Assignment"

# Dependencies are already installed, so just run:
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║   Career Guidance Platform API Server                ║
║   Environment: development                            ║
║   Port: 5000                                          ║
║   Status: Running ✓                                   ║
╚═══════════════════════════════════════════════════════╝
```

## Step 4: Test the API

### Option 1: Using Browser
Open: http://localhost:5000/health

Should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-04T..."
}
```

### Option 2: Using Postman/Thunder Client

#### Test 1: Register a User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker"
}
```

#### Test 2: Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123"
}
```

Copy the `token` from the response and use it for authenticated requests.

## Step 5: Verify Firestore

1. Go back to Firebase Console
2. Click on "Firestore Database"
3. You should see a new `users` collection with your test user

## 🎉 You're All Set!

Your backend is now running and connected to Firebase!

## Common Issues

### Issue: "Firebase Admin SDK error"
**Solution**: Check that your FIREBASE_PRIVATE_KEY has `\n` characters properly escaped

### Issue: "Port 5000 already in use"
**Solution**: Change PORT in .env to 5001 or another available port

### Issue: "Cannot find module"
**Solution**: Run `npm install` again

## Next Steps

1. ✅ Install Postman or Thunder Client for API testing
2. ✅ Read the API documentation in README.md
3. ✅ Test all endpoints
4. ✅ Build the frontend (React app in client folder)
5. ✅ Deploy to production

## Need Help?

- Check README.md for full documentation
- Check DEVNOTES.md for development tips
- Review Firebase Console for any configuration issues

---

**IMPORTANT SECURITY NOTES:**
- Never commit your `.env` file to Git
- Never share your Firebase Admin SDK JSON file
- Use strong JWT secrets in production
- Enable Firebase security rules before deploying
