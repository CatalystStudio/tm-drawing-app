'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Trophy, Users, RefreshCw, Check, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WinnerPage() {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [entrants, setEntrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_PIN = '6779';

  useEffect(() => {
    if (isAuthorized) {
      fetchEntrants();
    }
  }, [isAuthorized]);

  const fetchEntrants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entrants')
      .select('*')
      .eq('is_winner', false)
      .eq('disqualified', false);

    if (error) setError(error.message);
    else setEntrants(data || []);
    setLoading(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthorized(true);
    } else {
      alert('Incorrect PIN');
      setPin('');
    }
  };

  const startDrawing = () => {
    if (entrants.length === 0) return;
    setDrawing(true);
    setSelectedWinner(null);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          selectRandomWinner();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const selectRandomWinner = () => {
    const winner = entrants[Math.floor(Math.random() * entrants.length)];
    setSelectedWinner(winner);
    setDrawing(false);
  };

  const confirmWinner = async () => {
    if (!selectedWinner) return;
    const { error } = await supabase
      .from('entrants')
      .update({ is_winner: true })
      .eq('id', selectedWinner.id);

    if (error) alert(error.message);
    else {
      alert('Winner confirmed!');
      setSelectedWinner(null);
      fetchEntrants();
    }
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 text-primary rounded-full">
              <Shield size={32} />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center mb-6">Admin Access</h1>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN"
              className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-primary outline-none"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <button className="w-full py-3 bg-primary text-white font-bold rounded-lg">
              Unlock Terminal
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Prize Drawing Terminal</h1>
            <p className="text-slate-500">AHR Tradeshow 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
              <Users className="text-primary" size={20} />
              <div>
                <div className="text-2xl font-bold">{entrants.length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Entrants</div>
              </div>
            </div>
            <button 
              onClick={fetchEntrants}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="relative min-h-[400px] flex items-center justify-center bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {!drawing && !selectedWinner && !countdown && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <div className="inline-flex p-6 bg-slate-50 text-slate-300 rounded-full mb-6">
                  <Trophy size={64} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready for Drawing?</h2>
                <button
                  onClick={startDrawing}
                  disabled={entrants.length === 0}
                  className="px-12 py-4 bg-primary text-white text-xl font-bold rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  Draw Random Winner
                </button>
              </motion.div>
            )}

            {countdown !== null && (
              <motion.div
                key="countdown"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-9xl font-black text-primary"
              >
                {countdown}
              </motion.div>
            )}

            {selectedWinner && (
              <motion.div
                key="winner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center"
              >
                <div className="inline-flex p-4 bg-amber-100 text-amber-600 rounded-full mb-6 animate-bounce">
                  <Trophy size={48} />
                </div>
                <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary mb-2">We Have a Winner!</h2>
                <div className="mb-8">
                  <div className="text-5xl font-black text-slate-900 mb-2">{selectedWinner.name}</div>
                  <div className="text-xl text-slate-600 font-medium">{selectedWinner.company}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                  <div className="p-4 bg-slate-50 rounded-xl text-left border border-slate-100">
                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Email</div>
                    <div className="text-sm font-semibold truncate">{selectedWinner.email}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-left border border-slate-100">
                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Phone</div>
                    <div className="text-sm font-semibold">{selectedWinner.phone}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={confirmWinner}
                    className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <Check size={20} />
                    Confirm Selection
                  </button>
                  <button
                    onClick={() => setSelectedWinner(null)}
                    className="w-full sm:w-auto px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <X size={20} />
                    Draw Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-12 text-center text-slate-400 text-sm">
          AHR Tradeshow Admin Dashboard • Powered by <a href="https://www.catalysts.net" className="text-primary hover:underline">Catalyst Studio</a>
        </footer>
      </div>
    </main>
  );
}
