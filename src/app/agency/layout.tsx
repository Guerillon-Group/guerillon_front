'use client';

import { AgencySidebar } from '@/components/shared/AgencySidebar';
import { Bell, Search, User } from 'lucide-react';

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <AgencySidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <header className="h-20 bg-slate-900/60 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un bien, agent, client..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-sm">
                AG
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Prestige Immobilier</div>
                <div className="text-[10px] text-slate-400">Agence Partenaire</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
