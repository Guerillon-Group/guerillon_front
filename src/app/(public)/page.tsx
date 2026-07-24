import { HeroSearchSection } from '@/components/shared/HeroSearchSection';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { MOCK_PROPERTIES } from '@/features/property/services/mockData';
import { Building2, ShieldCheck, Award, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero & Search */}
      <HeroSearchSection />

      {/* 2. Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">Sélection d'exception</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Biens Immobilier en Vedette</h2>
          </div>
          <Link href="/properties" className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm hover:underline">
            Voir tout le catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROPERTIES.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 3. Categories Section */}
      <section className="bg-slate-900/60 py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Explorez par Catégories</h2>
            <p className="text-slate-400 text-sm">Trouvez précisément le type d'immeuble adapté à vos investissements ou besoins de logement.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Villas de Luxe', count: '42 Biens', icon: Building2 },
              { title: 'Appartements', count: '128 Biens', icon: Building2 },
              { title: 'Immeubles de Rapport', count: '18 Biens', icon: Building2 },
              { title: 'Bureaux & Commerces', count: '35 Biens', icon: Building2 },
            ].map((cat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{cat.title}</h3>
                <span className="text-xs text-slate-400">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Expertise & Sécurité</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Pourquoi nous confier vos projets immobiliers ?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nous réunissons les meilleures agences et agents certifiés pour vous offrir des garanties juridiques et financières optimales lors de chaque transaction.
            </p>

            <div className="space-y-4 pt-2">
              {[
                "Annonces d'immeubles 100% vérifiées sur le terrain",
                "Contrats de bail et actes de vente entièrement numérisés",
                "Accompagnement personnalisé par des agents certifiés",
                "Paiements sécurisés et suivi transparent"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80"
              alt="Immeuble moderne"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
