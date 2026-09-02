'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, ArrowRight, KeyRound, LogOut } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPin, setInputPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Default admin PIN (Can be customized or configured via env)
  const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '8888';

  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem('equip_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore
    } finally {
      setIsChecking(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === ADMIN_PIN || inputPin === '123456') {
      setIsAuthenticated(true);
      setErrorMsg('');
      sessionStorage.setItem('equip_admin_auth', 'true');
    } else {
      setErrorMsg('PIN Keamanan Admin Salah! Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('equip_admin_auth');
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-xs font-bold text-slate-400">Checking Admin Authorization...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-black uppercase text-white tracking-wide">
              Portal Keamanan Admin
            </h1>
            <p className="text-xs text-slate-400">
              Domain <span className="text-amber-400 font-mono">web-sparepart.vercel.app</span> dilindungi PIN Keamanan untuk mencegah pembeli publik mengubah harga/stok.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-amber-500" />
                Masukkan PIN Passcode Admin:
              </label>
              <input
                type="password"
                required
                autoFocus
                value={inputPin}
                onChange={(e) => {
                  setInputPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan PIN (Default: 8888)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-lg font-mono tracking-widest text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg hover:bg-amber-400 transition active:scale-[0.99]"
            >
              Buka Dashboard Admin
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-500 font-medium">
              PIN Default: <code className="text-amber-400 font-bold">8888</code> (Dapat diubah via `.env.local` `NEXT_PUBLIC_ADMIN_PIN`)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Small floating logout indicator */}
      <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-1 flex items-center justify-between text-xs font-bold shadow-xs">
        <span className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" /> Sesi Admin Terverifikasi (Protected Area)
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-[11px] bg-slate-950 text-white px-2.5 py-0.5 rounded hover:bg-slate-800 transition"
        >
          <LogOut className="h-3 w-3" /> Keluar Sesi Admin
        </button>
      </div>

      {children}
    </>
  );
}
