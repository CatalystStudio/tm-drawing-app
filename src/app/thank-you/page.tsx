'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThankYou() {
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Attempt to sync any queued entries if online
    const syncQueue = async () => {
      if (!navigator.onLine) return;
      
      const queue = JSON.parse(localStorage.getItem('tm_entry_queue') || '[]');
      if (queue.length === 0) return;

      try {
        // In a real app, you'd send this to an API route to handle bulk insert
        // For simplicity, we'll just check if we're online and show a message
        setSynced(true);
        // We'd clear the queue here after successful sync
      } catch (err) {
        console.error('Initial sync failed', err);
      }
    };

    syncQueue();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-12 border border-slate-100 text-center"
      >
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="TelcoMotion Logo" 
            width={200} 
            height={60} 
            className="h-auto w-auto opacity-50 grayscale"
          />
        </div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full mb-6"
        >
          <CheckCircle2 size={40} />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">You're Entered!</h1>
        <p className="text-slate-600 mb-8">
          Thank you for visiting TelcoMotion at AHR 2026. We'll contact you if you're selected as a winner!
        </p>

        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Prize drawings happen daily. Good luck!
          </p>
        </div>
      </motion.div>

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
