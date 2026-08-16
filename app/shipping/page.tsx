import { EGYPT_GOVERNORATES } from '@/lib/types';
import { Truck, MapPin, Clock } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex h-14 w-14 rounded-full bg-brand-gradient items-center justify-center mb-4">
          <Truck className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Shipping Information</h1>
        <p className="text-white/50 mt-2">We deliver to all 27 governorates across Egypt</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {EGYPT_GOVERNORATES.map((gov) => (
          <div
            key={gov.name}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-brand-navy-card p-4 hover:border-brand-cyan/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-brand-cyan" />
              </div>
              <span className="font-semibold text-white">{gov.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/50">
              <Clock className="h-3.5 w-3.5" />
              {gov.days}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-brand-navy-card p-6 text-center">
        <p className="text-white/60 text-sm">
          All orders are prepaid. Shipping costs are calculated at checkout based on your location.
          Orders are dispatched within 24 hours of payment confirmation.
        </p>
      </div>
    </div>
  );
}
