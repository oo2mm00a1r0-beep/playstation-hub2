'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONSOLES } from '@/lib/types';
import { Check, Upload, Gamepad2 } from 'lucide-react';

const CONDITIONS = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] as const;

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    item_name: '',
    console: 'PS5',
    condition: 'Used - Good',
    asking_price: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          asking_price: form.asking_price ? parseFloat(form.asking_price) : null,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Submission Received!</h1>
        <p className="text-white/60 mb-8">We&apos;ll review your device and contact you within 24 hours with our offer.</p>
        <Button onClick={() => setSubmitted(false)} className="bg-brand-gradient text-white">
          Submit Another Device
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex h-14 w-14 rounded-full bg-brand-gradient items-center justify-center mb-4">
          <Gamepad2 className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Sell Your Console or Games</h1>
        <p className="text-white/50 mt-2">Get a fair price for your old PlayStation gear. Fill the form below and we&apos;ll get back to you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-brand-navy-card border border-white/10 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white/70">Your Name</Label>
            <Input
              required
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Phone</Label>
            <Input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              placeholder="01X XXXX XXXX"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Item Name</Label>
          <Input
            required
            value={form.item_name}
            onChange={(e) => setForm({ ...form, item_name: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            placeholder="e.g. PlayStation 4 Pro 1TB"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white/70">Console</Label>
            <Select value={form.console} onValueChange={(v) => setForm({ ...form, console: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-brand-navy-card border-white/10">
                {CONSOLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Condition</Label>
            <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-brand-navy-card border-white/10">
                {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Asking Price (EGP) — optional</Label>
          <Input
            type="number"
            value={form.asking_price}
            onChange={(e) => setForm({ ...form, asking_price: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            placeholder="e.g. 5000"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Notes</Label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
            placeholder="Include any accessories, original box, or details about the condition..."
          />
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-2 text-xs text-white/40">
          <Upload className="h-4 w-4" /> Photo upload coming soon — describe your item condition in the notes for now.
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full h-12 bg-brand-gradient text-white hover:opacity-90">
          {loading ? 'Submitting...' : 'Submit for Review'}
        </Button>
      </form>
    </div>
  );
}
