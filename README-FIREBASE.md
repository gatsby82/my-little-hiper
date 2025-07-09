# Firebase Setup for My Little Hiper

This document provides instructions on how to set up Firebase for the My Little Hiper application.

## Prerequisites

- A Google account
- Node.js and npm installed (already included in the project)

## Steps to Set Up Firebase

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "my-little-hiper")
4. Follow the prompts to set up your project
5. Once the project is created, you'll be taken to the project dashboard

### 2. Register Your Web Application

1. From the project dashboard, click on the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "my-little-hiper-web")
3. Check the box for "Also set up Firebase Hosting" if you plan to deploy the app
4. Click "Register app"
5. Firebase will provide you with configuration details that look like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

6. Copy these configuration details for the next step

### 3. Update Environment Files

1. Open the environment files in the project:
   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production)

2. Replace the placeholder Firebase configuration with your actual configuration:

```typescript
export const environment = {
  production: false, // or true for production
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};
```

### 4. Set Up Firestore Database

1. From the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development, test mode is easier)
4. Select a location for your database
5. Click "Enable"

### 5. Create Firestore Security Rules

1. In the Firestore Database section, go to the "Rules" tab
2. Update the rules to allow read/write access (for development only):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note:** For production, you should implement proper security rules based on your authentication requirements.

## Using Firebase in the Application

The application is already set up to use Firebase. The main components are:

1. **Firebase Service**: `src/app/services/firebase.service.ts` provides methods for interacting with Firestore.
2. **App Configuration**: `src/app/app.config.ts` initializes Firebase and Firestore.
3. **Site Search Component**: `src/app/site/site-search/site-search.component.ts` uses the Firebase service to perform CRUD operations.

When you first run the application, it will:
1. Try to load sites from the 'sites' collection in Firestore
2. If no sites exist, it will initialize sample data

## Additional Firebase Features

This setup includes basic Firestore integration. You can extend it with other Firebase features:

- **Authentication**: Add user authentication
- **Storage**: Store files and images
- **Cloud Functions**: Add serverless backend functionality
- **Hosting**: Deploy your application to Firebase Hosting

Refer to the [Firebase documentation](https://firebase.google.com/docs) for more information on these features.
