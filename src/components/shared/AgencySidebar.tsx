'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, UserCheck, CalendarCheck, DollarSign, BarChart3, Settings, LogOut, ChevronRight } from 'lucide-react';

export function AgencySidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Vue d\'ensemble', href: '/agency/dashboard', icon: LayoutDashboard },
    { name: 'Biens publiés', href: '/agency/properties', icon: Building2 },
    { name: 'Agents', href: '/agency/agents', icon: UserCheck },
    { name: 'Clients', href: '/agency/customers', icon: Users },
    { name: 'Visites', href: '/agency/visits', icon: CalendarCheck },
    { name: 'Paiements & Revenus', href: '/agency/payments', icon: DollarSign },
    { name: 'Statistiques', href: '/agency/statistics', icon: BarChart3 },
    { name: 'Paramètres', href: '/agency/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-extrabold text-lg leading-none">Immo<span className="text-amber-400">Prestige</span></div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Espace Agence</span>
          </div>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
