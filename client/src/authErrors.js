// Friendly, human-readable messages for common Firebase Auth error codes.
// Shared by the Login and Signup forms so users see clear guidance instead of
// raw SDK error strings (e.g. "auth/wrong-password").
export function getAuthErrorMessage(error) {
  const code = error && error.code ? error.code : '';

  const messages = {
    // Sign-up
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
    'auth/weak-password': 'Password is too weak — use at least 6 characters.',
    'auth/operation-not-allowed': 'Email/password sign-up is currently disabled.',
    // Sign-in
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    // General
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  };

  if (messages[code]) return messages[code];
  return error && error.message
    ? `Unable to complete: ${error.message}`
    : 'Something went wrong. Please try again.';
}
