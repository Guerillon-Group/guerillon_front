'use client';

import Link from 'next/link';
import { Home, Building2, Search, Heart, User, Menu, X, PhoneCall } from 'lucide-react';
import { useState } from 'react';

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Immo<span className="text-amber-400">Prestige</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-300">
          <Link href="/" className="hover:text-amber-400 transition-colors">Accueil</Link>
          <Link href="/rentals" className="hover:text-amber-400 transition-colors">Location</Link>
          <Link href="/sales" className="hover:text-amber-400 transition-colors">Vente</Link>
          <Link href="/agencies" className="hover:text-amber-400 transition-colors">Agences</Link>
          <Link href="/agents" className="hover:text-amber-400 transition-colors">Agents</Link>
          <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-amber-400 transition-colors">À propos</Link>
          <Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <User className="w-4 h-4 text-amber-400" />
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
          >
            Publier un bien
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-4 pb-6 space-y-4">
          <Link href="/" className="block text-slate-300 hover:text-amber-400 py-1">Accueil</Link>
          <Link href="/rentals" className="block text-slate-300 hover:text-amber-400 py-1">Location</Link>
          <Link href="/sales" className="block text-slate-300 hover:text-amber-400 py-1">Vente</Link>
          <Link href="/agencies" className="block text-slate-300 hover:text-amber-400 py-1">Agences</Link>
          <Link href="/agents" className="block text-slate-300 hover:text-amber-400 py-1">Agents</Link>
          <Link href="/about" className="block text-slate-300 hover:text-amber-400 py-1">À propos</Link>
          <Link href="/contact" className="block text-slate-300 hover:text-amber-400 py-1">Contact</Link>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link href="/login" className="text-center py-2.5 rounded-xl bg-slate-800 text-white font-medium">Connexion</Link>
            <Link href="/register" className="text-center py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold">Publier un bien</Link>
          </div>
        </div>
      )}
    </header>
  );
}
