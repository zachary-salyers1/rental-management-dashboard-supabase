import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import GoogleSignIn from './GoogleSignIn';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Failed to create an account');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-secondary">
            Email
          </label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-secondary">
            Password
          </label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        >
          Sign Up
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card-bg text-secondary">Or continue with</span>
        </div>
      </div>
      <GoogleSignIn />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SignUp;