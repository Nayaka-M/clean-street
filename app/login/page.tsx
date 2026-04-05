'use client';
import { loginAction } from '@/lib/actions'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    try {
      await loginAction(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Login to CleanStreet</h1>
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input name="password" type="password" required className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg">
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500">
          Don't have an account? <a href="/register" className="text-blue-600 font-medium">Register</a>
        </p>
      </div>
    </div>
  );
}