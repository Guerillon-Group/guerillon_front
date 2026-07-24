import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Globe, Share2, MessageSquare } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                Immo<span className="text-amber-400">Prestige</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 pr-6">
              Votre plateforme d'exception dédiée à la vente, la location et la gestion immobilière de haut standing. Découvrez des immeubles, villas et appartements d'exception.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Navigations</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/rentals" className="hover:text-amber-400 transition-colors">Locations d'immeubles</Link></li>
              <li><Link href="/sales" className="hover:text-amber-400 transition-colors">Ventes immobilières</Link></li>
              <li><Link href="/agencies" className="hover:text-amber-400 transition-colors">Agences partenaires</Link></li>
              <li><Link href="/agents" className="hover:text-amber-400 transition-colors">Nos agents</Link></li>
              <li><Link href="/blog" className="hover:text-amber-400 transition-colors">Actualités & Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Support & Légal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">Foire Aux Questions</Link></li>
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">À propos de nous</Link></li>
              <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Nous contacter</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Almadies, Boulevard de la Corniche Ouest, Dakar</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span>+221 33 800 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <span>contact@immoprestige.sn</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ImmoPrestige. Tous droits réservés.</p>
          <p>Conçu pour la vente et location d'immeubles de haut standing.</p>
        </div>
      </div>
    </footer>
  );
}
