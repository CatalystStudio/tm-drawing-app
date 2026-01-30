'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check network status
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    handleStatusChange();

    // Check for previous entry on this device
    const hasEntered = localStorage.getItem('tm_entry_submitted');
    if (hasEntered) {
      router.push('/thank-you');
    }

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const entry = {
      ...formData,
      created_at: new Date().toISOString(),
    };

    try {
      if (navigator.onLine) {
        const { error: sbError } = await supabase
          .from('entrants')
          .insert([entry]);

        if (sbError) {
          if (sbError.code === '23505') {
            throw new Error('This email has already been entered.');
          }
          throw sbError;
        }
      } else {
        // Handle offline: Save to queue
        const queue = JSON.parse(localStorage.getItem('tm_entry_queue') || '[]');
        queue.push(entry);
        localStorage.setItem('tm_entry_queue', JSON.stringify(queue));
      }

      // Mark as submitted on this device
      localStorage.setItem('tm_entry_submitted', 'true');
      router.push('/thank-you');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="TelcoMotion Logo" 
            width={300} 
            height={100} 
            priority
            className="h-auto w-auto max-h-24"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Daily Prize Drawing</h1>
          <p className="text-slate-600">Enter your details for a chance to win!</p>
          {isOffline && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 px-4 rounded-full text-sm font-medium">
              <AlertCircle size={16} />
              Spotty connection? We'll save your entry!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-accent outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-accent outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              required
              type="tel"
              placeholder="(555) 000-0000"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-accent outline-none transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input
              required
              type="text"
              placeholder="Your Company"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-accent outline-none transition-all"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-primary hover:bg-opacity-90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Enter to Win'
            )}
          </button>
        </form>
      </div>

      <footer className="mt-8 text-center">
        <a 
          href="https://www.catalysts.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-primary transition-colors"
        >
          Powered by Catalyst Studio
        </a>
      </footer>
    </main>
  );
}
