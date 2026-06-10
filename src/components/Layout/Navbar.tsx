'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, FileText, LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then((res: any) => {
      const session = res?.data?.session;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Main Glass Navbar */}
      <div className="w-full border-b border-slate-800 bg-[#030712]/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-indigo-500 to-sky-500 p-2 rounded-lg group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                NovaLens
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded bg-indigo-500/10">
                IN Law
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/analyze"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive('/analyze') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Analyze Contract
              </Link>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
            <Link
              href="/analyze"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Analyze Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/analyze"
              className="px-3 py-1.5 rounded-md bg-indigo-600 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              Analyze
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-b border-slate-800 bg-[#070b14] px-4 pt-2 pb-6 flex flex-col gap-4 animate-fade-in">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 p-2 rounded-lg ${
              isActive('/dashboard') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 p-2 rounded-lg ${
              isActive('/analyze') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Analyze Contract
          </Link>
          <hr className="border-slate-800" />
          <div className="flex flex-col gap-3">
            {user && (
              <div className="flex flex-col gap-2">
                <div className="text-xs text-slate-400 px-2">Signed in as: {user.email}</div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-sm text-rose-400 bg-rose-500/10 rounded-lg hover:bg-rose-500/20"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
