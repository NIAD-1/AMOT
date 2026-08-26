import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">AMOT</h1>
        <p className="mt-2 text-sm text-slate-300">Advert Monitoring & Observation Tool</p>
        <p className="mt-1 text-xs text-slate-400">National Agency for Food and Drug Administration and Control</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1e3a5f] focus:border-[#1e3a5f] sm:text-sm"
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1e3a5f] focus:border-[#1e3a5f] sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <Button type="submit" fullWidth isLoading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-center font-medium text-gray-500 uppercase tracking-wider mb-3">Demo Accounts (any password)</p>
            <div className="space-y-1 text-xs text-gray-500">
              <button type="button" onClick={() => { setEmail('officer@amot.gov.ng'); setPassword('demo'); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition">
                <span className="font-semibold text-gray-700">Field Officer</span> — officer@amot.gov.ng
              </button>
              <button type="button" onClick={() => { setEmail('team@amot.gov.ng'); setPassword('demo'); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition">
                <span className="font-semibold text-gray-700">Advert Team</span> — team@amot.gov.ng
              </button>
              <button type="button" onClick={() => { setEmail('supervisor@amot.gov.ng'); setPassword('demo'); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition">
                <span className="font-semibold text-gray-700">Supervisor</span> — supervisor@amot.gov.ng
              </button>
              <button type="button" onClick={() => { setEmail('admin@amot.gov.ng'); setPassword('demo'); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition">
                <span className="font-semibold text-gray-700">Administrator</span> — admin@amot.gov.ng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
