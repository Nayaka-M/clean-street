'use client';
import { registerAction } from '@/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    try {
      await registerAction(formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Register for CleanStreet</h1>
        
        <form action={handleSubmit} className="space-y-5">
          <input 
            name="name" 
            placeholder="Full Name" 
            required 
            className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500" 
          />
          <input 
            name="username" 
            placeholder="Choose a username" 
            className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500" 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
            className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500" 
          />
          <input 
            name="phone" 
            placeholder="Phone Number (Optional)" 
            className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500" 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Create a password" 
            required 
            className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500" 
          />

          <div>
            <label className="block text-sm font-medium mb-2">Register As</label>
            <select 
              name="role" 
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
            >
              <option value="USER">Normal User</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account? <a href="/login" className="text-blue-600 font-medium">Login</a>
        </p>
      </div>
    </div>
  );
}