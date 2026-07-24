'use client';

import Link from 'next/link';
import { Bed, Bath, Maximize2, MapPin, Heart, Sparkles } from 'lucide-react';
import { Property } from '@/features/property/types';

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            property.type === 'sale' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
          }`}>
            {property.type === 'sale' ? 'À Vendre' : 'À Louer'}
          </span>
          {property.isFeatured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Vedette
            </span>
          )}
        </div>

        {/* Favorite btn */}
        <button className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-rose-500 transition-colors border border-slate-700/50">
          <Heart className="w-4 h-4" />
        </button>

        {/* Price */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-2xl font-extrabold text-white">
              {property.price.toLocaleString('fr-FR')} {property.type === 'sale' ? 'FCFA' : 'FCFA / mois'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{property.address}, {property.city}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            <Link href={`/properties/${property.slug}`}>
              {property.title}
            </Link>
          </h3>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Specs */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-amber-400" />
            <span>{property.bedrooms} Ch.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-amber-400" />
            <span>{property.bathrooms} SDB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-amber-400" />
            <span>{property.areaSqFt} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
