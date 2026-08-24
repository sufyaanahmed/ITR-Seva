import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Login() {
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state, loginUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.auth.isLoggedIn) {
      navigate('/dashboard');
    }
  }, [state.auth.isLoggedIn, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!pan || !password) {
      setError('Please enter PAN and password.');
      return;
    }
    
    // PAN Logic: 4th character determines entity
    const panStr = pan.toUpperCase();
    if (panStr.length >= 4) {
      const char4 = panStr.charAt(3);
      if (char4 === 'C') {
        loginUser('Company');
      } else if (char4 === 'F') {
        loginUser('Firm');
      } else {
        loginUser('Individual');
      }
      navigate('/dashboard');
    } else {
      setError('Invalid PAN format.');
    }
  };

  const handleDemoLogin = (type) => {
    loginUser(type);
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
                <span className="px-2 bg-white text-gray-500 font-bold text-primary">Testing Quick Logins</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => { setPan('ABCPS1234K'); setPassword('demo'); handleDemoLogin('Individual'); }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-white text-sm font-medium hover:bg-gray-50 text-gray-600"
              >
                Login as <span className="font-bold text-primary ml-1">Individual</span> (ABCPS1234K)
              </button>
              <button
                onClick={() => { setPan('AABCT1234F'); setPassword('demo'); handleDemoLogin('Company'); }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-white text-sm font-medium hover:bg-gray-50 text-gray-600"
              >
                Login as <span className="font-bold text-primary ml-1">Company</span> (AABCT1234F)
              </button>
              <button
                onClick={() => { setPan('AAIFS5678L'); setPassword('demo'); handleDemoLogin('Firm'); }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-white text-sm font-medium hover:bg-gray-50 text-gray-600"
              >
                Login as <span className="font-bold text-primary ml-1">Firm</span> (AAIFS5678L)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
