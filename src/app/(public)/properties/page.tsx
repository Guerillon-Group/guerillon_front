import { PropertyCard } from '@/components/shared/PropertyCard';
import { MOCK_PROPERTIES } from '@/features/property/services/mockData';
import { Search, Filter } from 'lucide-react';

export default function PropertiesSearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Catalogue Général des Biens</h1>
        <p className="text-slate-400 text-sm mt-1">Découvrez tous nos immeubles, villas et appartements disponibles à la vente et à la location.</p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par adresse, quartier, ville..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white cursor-pointer focus:outline-none">
            <option>Tous les types</option>
            <option>À Vendre</option>
            <option>À Louer</option>
          </select>
          <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white cursor-pointer focus:outline-none">
            <option>Toutes les villes</option>
            <option>Dakar</option>
            <option>Saly</option>
          </select>
        </div>
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PROPERTIES.map((prop) => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </div>
  );
}
