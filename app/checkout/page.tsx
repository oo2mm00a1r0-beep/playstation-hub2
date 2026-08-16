'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart';
import { EGYPT_GOVERNORATES } from '@/lib/types';
import { Check, CreditCard, Loader2, Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    governorate: 'Cairo',
    address: '',
  });

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
          total,
          payment_status: 'Pending',
        }),
      });
      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();
      setOrderId(data.id);
      setStep('payment');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handlePayment = async (success: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          success,
        }),
      });
      if (!res.ok) throw new Error('Payment failed');
      if (success) {
        clear();
        setStep('success');
      } else {
        setError('Payment failed. Please try again or use a different card.');
      }
    } catch {
      setError('Payment processing failed.');
    }
    setLoading(false);
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-white/20 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-white/50 mb-6">Add some products before checking out.</p>
        <Button asChild className="bg-brand-gradient text-white">
          <Link href="/consoles">Browse Products</Link>
        </Button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-6 animate-pop-in">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Order Confirmed!</h1>
        <p className="text-white/60 mb-2">Thank you for your purchase.</p>
        <p className="text-white/40 text-sm mb-8">Order ID: <span className="font-mono text-brand-cyan">{orderId.slice(0, 8)}</span></p>
        <Button asChild className="bg-brand-gradient text-white">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-5 bg-brand-navy-card border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white">Shipping Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Full Name</Label>
                  <Input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Phone</Label>
                  <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="01X XXXX XXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Governorate</Label>
                <Select value={form.governorate} onValueChange={(v) => setForm({ ...form, governorate: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-brand-navy-card border-white/10">
                    {EGYPT_GOVERNORATES.map((g) => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Address</Label>
                <Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="Street, building, apartment..." />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full h-12 bg-brand-gradient text-white">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue to Payment'}
              </Button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-5 bg-brand-navy-card border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-brand-cyan" />
                <h2 className="text-xl font-bold text-white">Payment</h2>
              </div>
              <p className="text-sm text-white/50">Prepaid only — no cash on delivery. This is a simulated payment for demonstration.</p>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-brand-cyan" />
                  <span className="text-sm text-white/70">Naspay (Demo Mode)</span>
                </div>
                <div className="h-10 rounded-lg bg-white/5 flex items-center px-3 text-white/30 text-sm">Card number (demo)</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 rounded-lg bg-white/5 flex items-center px-3 text-white/30 text-sm">MM/YY</div>
                  <div className="h-10 rounded-lg bg-white/5 flex items-center px-3 text-white/30 text-sm">CVC</div>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="space-y-2">
                <Button onClick={() => handlePayment(true)} disabled={loading} className="w-full h-12 bg-brand-gradient text-white">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Pay Now — EGP ' + total.toLocaleString()}
                </Button>
                <Button onClick={() => handlePayment(false)} disabled={loading} variant="outline" className="w-full border-white/20 text-white/60">
                  Simulate Failed Payment
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-brand-navy-card border border-white/10 rounded-2xl p-6 h-fit space-y-4">
          <h2 className="font-bold text-white">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.product.images[0] || 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=200'} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                  <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-brand-cyan">EGP {(item.quantity * Number(item.product.price)).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/60">Total</span>
            <span className="text-xl font-bold text-white">EGP {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
