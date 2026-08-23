import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore, DEMO_USER } from '../store';

export default function Login() {
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { updateAuth } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo logic: accept any non-empty PAN for the demo, but actually log them in as Rahul
    if (pan && password) {
      updateAuth({ isLoggedIn: true, user: DEMO_USER });
      navigate('/dashboard');
    } else {
      setError('Please enter PAN and password.');
    }
  };

  const handleDemoLogin = () => {
    updateAuth({ isLoggedIn: true, user: DEMO_USER });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <img src="/Emblem_of_India.svg" alt="Emblem" className="mx-auto h-16 w-auto mb-4" />
        </Link>
        <h2 className="mt-2 text-3xl font-extrabold text-primary">Login to e-Filing</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Or <a href="#" className="font-medium text-primary hover:text-primary-dark">register a new account</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-primary">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <div className="text-error text-sm font-bold bg-red-50 p-2 rounded">{error}</div>}
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                PAN / Aadhaar / User ID
              </label>
              <div className="mt-1">
                <input
                  id="pan"
                  name="pan"
                  type="text"
                  required
                  className="input-field uppercase"
                  value={pan}
                  onChange={e => setPan(e.target.value)}
                  placeholder="e.g. ABCPS1234K"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Secure my account
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
              >
                Continue
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Access</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleDemoLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="text-primary font-bold">1-Click Demo Login (Rahul Sharma)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
