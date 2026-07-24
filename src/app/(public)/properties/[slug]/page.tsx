'use client';

import dynamic from 'next/dynamic';
import { MOCK_PROPERTIES } from '@/features/property/services/mockData';
import { useState } from 'react';
import { Bed, Bath, Maximize2, MapPin, Calendar, Phone, Mail, FileText, Share2, Heart, Check, Star } from 'lucide-react';
import Link from 'next/link';

// Dynamically import Leaflet Map component with SSR disabled
const DynamicMap = dynamic(
  () => import('@/components/shared/PropertyMap'),
  { ssr: false, loading: () => <div className="h-72 bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center text-slate-500">Chargement de la carte...</div> }
);

export default function PropertyDetailPage() {
  const property = MOCK_PROPERTIES[0]; // Property exemple
  const [selectedImg, setSelectedImg] = useState<number>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500 text-slate-950">
              {property.type === 'sale' ? 'À Vendre' : 'À Louer'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Ref: #IMMO-{property.id}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{property.title}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{property.address}, {property.city}</span>
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="text-xs text-slate-400 font-medium mb-1">Prix demandé</div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400">
            {property.price.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-4">
        <div className="aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
          <img
            src={property.images[selectedImg]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {property.images.map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedImg(i)}
              className={`relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedImg === i ? 'border-amber-400 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content & Sidebar Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Key specs bar */}
          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <Bed className="w-5 h-5" />
              </div>
              <div className="text-lg font-bold text-white">{property.bedrooms}</div>
              <div className="text-xs text-slate-400">Chambres</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <Bath className="w-5 h-5" />
              </div>
              <div className="text-lg font-bold text-white">{property.bathrooms}</div>
              <div className="text-xs text-slate-400">Salles de bain</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div className="text-lg font-bold text-white">{property.areaSqFt} m²</div>
              <div className="text-xs text-slate-400">Superficie</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Description du bien</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              {property.description}
            </p>
          </div>

          {/* Features & Amenities */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Équipements & Caractéristiques</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity: string, i: number) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Emplacement & Carte</h2>
            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <DynamicMap lat={property.lat} lng={property.lng} title={property.title} />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Contact Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 sticky top-28">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <img
                src={property.agent?.avatar}
                alt={property.agent?.name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-bold text-white text-base">{property.agent?.name}</h3>
                <p className="text-xs text-amber-400 font-medium">{property.agency?.name}</p>
                <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9 (24 avis)</span>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Votre Nom complet</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Téléphone</label>
                <input
                  type="tel"
                  placeholder="+221 -- --- -- --"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Date de visite souhaitée</label>
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all"
              >
                Prendre Rendez-vous
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
