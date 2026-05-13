"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { getApiUrl } from '../utils';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = getApiUrl();
    try {
      await axios.post(`${apiUrl}/register`, {
        username,
        password
      });
      setSuccess(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Account created successfully!</p>
            <Link href="/" className="text-yellow-600 font-bold hover:underline">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200"
            >
              Register
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/" className="text-yellow-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
