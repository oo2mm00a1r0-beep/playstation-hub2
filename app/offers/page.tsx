'use client';

import { useEffect, useState } from 'react';
import { Tag, Clock } from 'lucide-react';
import type { Offer } from '@/lib/types';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offers')
      .then((r) => (r.ok ? r.json() : []))
      .then(setOffers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Special Offers</h1>
        <p className="text-white/50 mt-1">Save on selected items across the store</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 text-lg">No active offers right now.</p>
          <p className="text-white/30 text-sm mt-1">Check back soon for deals.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-brand-navy-card p-6 group hover:border-brand-cyan/40 transition-colors"
            >
              <div className="absolute -top-8 -right-8 h-32 w-32 bg-brand-gradient rounded-full blur-2xl opacity-20" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-full bg-brand-gradient flex items-center justify-center">
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-3xl font-extrabold text-brand-gradient">{offer.discount_percent}% OFF</span>
                </div>
                <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                <p className="text-white/60 mt-1 text-sm">{offer.description}</p>
                {offer.code && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                    <span className="text-xs text-white/50">Code:</span>
                    <span className="text-sm font-bold text-brand-cyan">{offer.code}</span>
                  </div>
                )}
                {offer.ends_at && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-white/40">
                    <Clock className="h-3.5 w-3.5" /> Ends {new Date(offer.ends_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
