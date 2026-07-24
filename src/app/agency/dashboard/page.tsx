'use client';

import { Building2, Users, CalendarCheck, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4500000 },
  { month: 'Fév', revenue: 5200000 },
  { month: 'Mar', revenue: 4800000 },
  { month: 'Avr', revenue: 6100000 },
  { month: 'Mai', revenue: 5900000 },
  { month: 'Juin', revenue: 7400000 },
];

export default function AgencyDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Tableau de bord Agence</h1>
        <p className="text-slate-400 text-sm mt-1">Aperçu général des performances, ventes, locations et activités de vos agents.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Revenus du mois', value: '7 400 000 FCFA', icon: DollarSign, change: '+18%', trend: 'up' },
          { title: 'Biens actifs', value: '24 Immeubles', icon: Building2, change: '+3 ce mois', trend: 'up' },
          { title: 'Agents actifs', value: '8 Agents', icon: Users, change: '100% dipo', trend: 'neutral' },
          { title: 'Visites ce mois', value: '56 Visites', icon: CalendarCheck, change: '+12%', trend: 'up' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Graph */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Évolution des Revenus (FCFA)</h2>
              <p className="text-xs text-slate-400">Paiements de commissions et loyers perçus</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white">Dernières visites programmées</h2>
          
          <div className="space-y-4">
            {[
              { client: 'Moussa Diop', property: 'Résidence Almadies', time: 'Aujourd\'hui 15h00' },
              { client: 'Awa Ndiaye', property: 'Appartement Plateau', time: 'Demain 10h30' },
              { client: 'Ibrahima Fall', property: 'Villa Saly', time: '26 Juillet 14h00' },
            ].map((visit, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{visit.client}</div>
                  <div className="text-xs text-amber-400">{visit.property}</div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                  {visit.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
