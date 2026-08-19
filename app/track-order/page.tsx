'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Search, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TrackedItem = {
  product?: { name?: string };
  quantity?: number;
};

type TrackedOrder = {
  order_id: string;
  payment_status: 'Pending' | 'Paid' | 'Failed';
  items: TrackedItem[];
  total: number;
  created_at: string;
};

const statusStyles: Record<TrackedOrder['payment_status'], string> = {
  Pending: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
  Paid: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
  Failed: 'bg-red-400/10 text-red-300 border-red-400/20',
};

export default function TrackOrderPage() {
  const [lookup, setLookup] = useState('');
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setOrders([]);

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lookup }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to find that order.');
      setOrders(result.orders || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to find that order.');
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-cyan/10">
          <Search className="h-7 w-7 text-brand-cyan" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Track Your Order</h1>
        <p className="mt-2 text-white/50">Enter your Order ID or the phone number used at checkout.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-brand-navy-card p-6">
        <div className="space-y-2">
          <Label htmlFor="order-lookup" className="text-white/70">Order ID or phone number</Label>
          <Input
            id="order-lookup"
            required
            value={lookup}
            onChange={(event) => setLookup(event.target.value)}
            placeholder="e.g. 2966b033-bbe9-43c9-8aa1-b02ec788c6a6 or 010..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-5 h-11 w-full bg-brand-gradient text-white">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Find Order'}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article key={order.order_id} className="rounded-2xl border border-white/10 bg-brand-navy-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Order ID</p>
                <p className="mt-1 break-all font-mono text-sm text-brand-cyan">{order.order_id}</p>
                <p className="mt-2 text-xs text-white/40">Placed {new Date(order.created_at).toLocaleString()}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-sm font-bold ${statusStyles[order.payment_status]}`}>
                {order.payment_status}
              </span>
            </div>

            <div className="py-4">
              <h2 className="mb-3 font-bold text-white">Items ordered</h2>
              <div className="space-y-2">
                {(order.items || []).map((item, index) => (
                  <div key={`${order.order_id}-${index}`} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-white/70">{item.product?.name || 'Product'} <span className="text-white/40">x{item.quantity || 1}</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-white/60">Total</span>
              <span className="text-xl font-bold text-white">EGP {Number(order.total).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>

      {orders.length > 0 && (
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="border-white/20 text-white/70">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40">
        <Package className="h-4 w-4" />
        <span>Only exact Order ID or phone matches return results.</span>
      </div>
    </div>
  );
}
