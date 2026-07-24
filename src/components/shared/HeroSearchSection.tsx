'use client';

import { useState } from 'react';
import { Search, MapPin, Building, DollarSign, Filter, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HeroSearchSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'sale' | 'rent'>('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.set('type', activeTab);
    if (query) params.set('query', query);
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-20 px-4 overflow-hidden bg-slate-950">
      {/* Background Decorator */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
        {/* Tag line */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-amber-400 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          N°1 de la Vente & Location d'Immeubles d'Exception
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
          Trouvez l'immeuble <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            de vos ambitions
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400">
          Résidences de luxe, bureaux modernes, villas ou immeubles complets. Explorez le plus vaste catalogue immobilier vérifié.
        </p>

        {/* Intelligent Search Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous les biens
            </button>
            <button
              onClick={() => setActiveTab('sale')}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'sale'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Acheter (Vente)
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'rent'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Louer (Location)
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 mb-1 text-left">Mot-clé</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Quartier, résidence..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 mb-1 text-left">Ville</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none w-full cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Toutes les villes</option>
                  <option value="Dakar" className="bg-slate-900">Dakar</option>
                  <option value="Saly" className="bg-slate-900">Saly</option>
                  <option value="Saint-Louis" className="bg-slate-900">Saint-Louis</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 mb-1 text-left">Type de bien</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                <Building className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent text-sm text-white focus:outline-none w-full cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Tous types</option>
                  <option value="villa" className="bg-slate-900">Villa de luxe</option>
                  <option value="apartment" className="bg-slate-900">Appartement</option>
                  <option value="building" className="bg-slate-900">Immeuble complet</option>
                  <option value="office" className="bg-slate-900">Bureaux</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                Rechercher
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
