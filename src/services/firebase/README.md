# Firebase Services

Comprehensive Firebase integration for Next.js 16 with TypeScript, featuring Authentication, Analytics, and Firestore services.

## 📁 Structure

```
src/services/firebase/
├── app.ts                 # Firebase app initialization
├── config.ts              # Configuration management
├── types.ts               # TypeScript type definitions
├── utils.ts               # Helper utilities
├── auth.ts                # Authentication service
├── analytics.ts           # Analytics service
├── firestore.ts           # Firestore database service
├── provider.ts            # React provider component
├── firebase.json          # Firebase configuration (gitignored)
└── index.ts               # Central export
```

## 🚀 Quick Start

### 1. Configuration

Create `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Or create `firebase.json` in this directory:

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "measurementId": "..."
}
```

### 2. Add Provider

Wrap your app with `FirebaseProvider` in `src/components/providers/index.tsx`:

```tsx
import { FirebaseProvider } from "@src/services/firebase";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <FirebaseProvider
      enableAnalytics={true} // Analytics enabled in all environments
      enableAuth={true}
      enableFirestore={false}
    >
      {/* Other providers */}
      {children}
    </FirebaseProvider>
  );
};
```

**Note**: Analytics is now enabled in development mode with debug logging. Check your browser console for analytics events.## 🔐 Authentication Service

### Using the Auth Hook

```tsx
import { useAuth } from "@hooks";

function MyComponent() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? (
    <div>
      <p>Welcome {user.displayName}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  ) : (
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  );
}
```

### Direct Service Usage

```tsx
import { authService } from "@src/services/firebase";

// Sign in with Google
const userCredential = await authService.signInWithGoogle();

// Sign in with email
const userCredential = await authService.signInWithEmail(email, password);

// Sign up with email
const userCredential = await authService.signUpWithEmail(email, password);

// Sign out
await authService.signOut();

// Get current user
const user = authService.getCurrentUser();

// Check authentication status
const isAuthenticated = authService.isAuthenticated();

// Get ID token
const token = await authService.getIdToken();

// Password reset
await authService.sendPasswordResetEmail(email);

// Update profile
await authService.updateUserProfile("New Name", "https://photo-url.com");

// Delete account
await authService.deleteUser();
```

## 📊 Analytics Service

### Predefined Events

```tsx
import { analyticsService, ANALYTICS_EVENTS } from "@src/services/firebase";

// Page view
await analyticsService.trackPageView("/home", "Home Page");

// Authentication
await analyticsService.trackAuth("google", true);

// Form submission
await analyticsService.trackFormSubmit("contact_form", true);

// Button click
await analyticsService.trackButtonClick("cta_button", "homepage");

// Custom error
await analyticsService.trackError("Payment failed", "PAYMENT_001");

// Generic event
await analyticsService.logEvent(ANALYTICS_EVENTS.PURCHASE, {
  value: 99.99,
  currency: "USD",
  transaction_id: "TXN123",
});
```

### User Tracking

```tsx
// Set user ID
await analyticsService.setUserId(user.uid);

// Set user properties
await analyticsService.setUserProperties({
  subscription_tier: "premium",
  preferred_language: "en",
});

// Set current screen (uses screen_view event)
await analyticsService.setCurrentScreen("HomeScreen", "MainActivity");
```

**Note**: `setCurrentScreen` now uses the recommended `screen_view` event instead of the deprecated `setCurrentScreen` API.

### Advanced Options

```tsx
// Event with retry
await analyticsService.logEvent(
  "critical_action",
  { action_id: "123" },
  { retry: true, maxRetries: 3 },
);

// Enable/disable analytics
analyticsService.setEnabled(false);

// Check availability
if (analyticsService.isAvailable()) {
  await analyticsService.logEvent("app_opened");
}
```

## 🗄️ Firestore Service

```tsx
import { firestoreService } from "@src/services/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

// Check if enabled
if (firestoreService.isEnabled()) {
  const db = firestoreService.getDatabase();

  // Get document
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  // Get collection
  const querySnapshot = await getDocs(collection(db, "posts"));
}
```

## 🛠️ Utilities

### Error Handling

```tsx
import {
  handleFirebaseError,
  getFirebaseErrorMessage,
} from "@src/services/firebase";

try {
  await authService.signInWithEmail(email, password);
} catch (error) {
  const userMessage = getFirebaseErrorMessage(error);
  console.error(userMessage);
  // Or
  throw handleFirebaseError(error, "Sign-in failed");
}
```

### Retry Operations

```tsx
import { retryOperation } from "@src/services/firebase";

const result = await retryOperation(async () => authService.getIdToken(true), {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
});
```

### Debounce/Throttle

```tsx
import { debounce, throttle } from "@src/services/firebase";

const debouncedSearch = debounce((query: string) => {
  analyticsService.logEvent("search", { query });
}, 500);

const throttledClick = throttle(() => {
  analyticsService.trackButtonClick("fast_button");
}, 1000);
```

## 🧪 Development

### Emulators

Configure emulators in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
```

### Debug Mode

Analytics debug mode is automatically enabled in development and analytics events are tracked even in development mode. Check browser console for detailed logs:

```
Analytics Event: page_view { page_location: '...', page_path: '/home', ... }
Analytics Event: button_click { button_name: 'cta_button', location: 'homepage' }
Firebase services initialized successfully
```

## 📝 Type Safety

All services are fully typed with TypeScript:

```tsx
import type {
  AuthService,
  AnalyticsService,
  FirebaseConfig,
  AnalyticsEventParams,
  AuthErrorCode,
} from "@src/services/firebase";
```

## 🏗️ Architecture Patterns

### Singleton Pattern

Each service (auth, analytics, firestore) uses a singleton pattern to ensure single initialization.

### Lazy Initialization

Services are initialized only when needed and only on the client side.

### Error Handling

All errors are caught, logged, and converted to user-friendly messages using centralized error handling.

### Validation

Configuration and input parameters are validated before use.

## 🔒 Security Best Practices

1. **Never commit `firebase.json`** - Add to `.gitignore`
2. **Use environment variables** for production
3. **Validate user input** before sending to Firebase
4. **Handle errors gracefully** with user-friendly messages
5. **Use security rules** in Firebase Console for Firestore

## 📚 References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase Analytics](https://firebase.google.com/docs/analytics)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)

## 🤝 Contributing

When adding new Firebase features:

1. Create service class in appropriate file
2. Export from `index.ts`
3. Add types to `types.ts`
4. Add utilities to `utils.ts`
5. Update this README
6. Add tests if applicable
