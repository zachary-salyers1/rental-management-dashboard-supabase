import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

const GoogleSignIn: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;