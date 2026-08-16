'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product, Order, SellSubmission, Offer } from '@/lib/types';
import { CONSOLES, CATEGORIES } from '@/lib/types';
import { Package, ShoppingCart, Store, Tag, LogOut, Plus, Trash2, Pencil, X, Check } from 'lucide-react';

type TabKey = 'products' | 'orders' | 'sell' | 'offers';

export function AdminDashboard() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<TabKey>('products');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/50 text-sm">Manage products, orders, and offers</p>
        </div>
        <Button onClick={signOut} variant="outline" className="border-white/20 text-white/70 hover:bg-white/5">
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6 bg-brand-navy-card border border-white/10">
          <TabsTrigger value="products" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white text-white/60"><Package className="h-4 w-4 mr-1.5" />Products</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white text-white/60"><ShoppingCart className="h-4 w-4 mr-1.5" />Orders</TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white text-white/60"><Store className="h-4 w-4 mr-1.5" />Sell</TabsTrigger>
          <TabsTrigger value="offers" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white text-white/60"><Tag className="h-4 w-4 mr-1.5" />Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="products"><ProductsTab /></TabsContent>
        <TabsContent value="orders"><OrdersTab /></TabsContent>
        <TabsContent value="sell"><SellTab /></TabsContent>
        <TabsContent value="offers"><OffersTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/60 text-sm">{products.length} products · {products.filter(p => p.status === 'available').length} available · {products.filter(p => p.status === 'sold').length} sold</p>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-brand-gradient text-white">
          <Plus className="h-4 w-4 mr-1.5" /> Add Product
        </Button>
      </div>

      {showForm && <ProductForm product={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={load} />}

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 bg-brand-navy-card border border-white/10 rounded-xl p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[0] || 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=200'} alt="" className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{p.name}</p>
              <p className="text-xs text-white/40">{p.console} · {p.category} · {p.condition} · EGP {Number(p.price).toLocaleString()}</p>
              <span className={`text-xs font-bold ${p.status === 'available' ? 'text-brand-cyan' : 'text-red-400'}`}>{p.status}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
              <button onClick={async () => { if (confirm('Delete this product?')) { await supabase.from('products').delete().eq('id', p.id); load(); } }} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    console: product?.console || 'PS5',
    category: product?.category || 'Consoles',
    condition: (product?.condition || 'New') as 'New' | 'Used',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    images: (product?.images || []).join(', '),
    status: (product?.status || 'available') as 'available' | 'sold',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      console: form.console,
      category: form.category,
      condition: form.condition,
      price: parseFloat(form.price),
      description: form.description,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      status: form.status,
    };
    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-navy-card border border-white/10 rounded-2xl p-6 space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">{product ? 'Edit Product' : 'Add Product'}</h3>
        <button type="button" onClick={onClose} className="text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2"><Label className="text-white/70">Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
        <div className="space-y-2"><Label className="text-white/70">Price (EGP)</Label><Input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2"><Label className="text-white/70">Console</Label><Select value={form.console} onValueChange={(v) => setForm({ ...form, console: v })}><SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-brand-navy-card border-white/10">{CONSOLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-white/70">Category</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-brand-navy-card border-white/10">{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-white/70">Condition</Label><Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v as 'New' | 'Used' })}><SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-brand-navy-card border-white/10"><SelectItem value="New">New</SelectItem><SelectItem value="Used">Used</SelectItem></SelectContent></Select></div>
      </div>
      <div className="space-y-2"><Label className="text-white/70">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[80px]" /></div>
      <div className="space-y-2"><Label className="text-white/70">Image URLs (comma-separated)</Label><Input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="https://..." /></div>
      <div className="space-y-2"><Label className="text-white/70">Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as 'available' | 'sold' })}><SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-brand-navy-card border-white/10"><SelectItem value="available">Available</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select></div>
      <Button type="submit" disabled={saving} className="bg-brand-gradient text-white">{saving ? 'Saving...' : 'Save Product'}</Button>
    </form>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="grid gap-3">
      {orders.length === 0 && <p className="text-white/50 text-center py-8">No orders yet.</p>}
      {orders.map((o) => (
        <div key={o.id} className="bg-brand-navy-card border border-white/10 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{o.customer_name} · {o.governorate}</p>
              <p className="text-xs text-white/40">{o.phone} · {new Date(o.created_at).toLocaleString()}</p>
            </div>
            <p className="font-bold text-brand-cyan">EGP {Number(o.total).toLocaleString()}</p>
          </div>
          <p className="text-sm text-white/60">{o.address}</p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-white/50">Payment:</span>
            <Select
              value={o.payment_status}
              onValueChange={async (v) => { await supabase.from('orders').update({ payment_status: v }).eq('id', o.id); load(); }}
            >
              <SelectTrigger className="w-32 h-8 bg-white/5 border-white/10 text-white text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-brand-navy-card border-white/10">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}

function SellTab() {
  const [submissions, setSubmissions] = useState<SellSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('sell_submissions').select('*').order('created_at', { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="grid gap-3">
      {submissions.length === 0 && <p className="text-white/50 text-center py-8">No sell submissions yet.</p>}
      {submissions.map((s) => (
        <div key={s.id} className="bg-brand-navy-card border border-white/10 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{s.item_name} · {s.console}</p>
              <p className="text-xs text-white/40">{s.customer_name} · {s.phone} · {new Date(s.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              {s.asking_price && <p className="font-bold text-brand-cyan">EGP {Number(s.asking_price).toLocaleString()}</p>}
              <p className="text-xs text-white/40">{s.condition}</p>
            </div>
          </div>
          {s.notes && <p className="text-sm text-white/60 bg-white/5 rounded-lg p-2">{s.notes}</p>}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-white/50">Status:</span>
            <Select
              value={s.status}
              onValueChange={async (v) => { await supabase.from('sell_submissions').update({ status: v }).eq('id', s.id); load(); }}
            >
              <SelectTrigger className="w-32 h-8 bg-white/5 border-white/10 text-white text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-brand-navy-card border-white/10">
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}

function OffersTab() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    setOffers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(!showForm)} className="bg-brand-gradient text-white">
        <Plus className="h-4 w-4 mr-1.5" /> Add Offer
      </Button>

      {showForm && <OfferForm onClose={() => setShowForm(false)} onSaved={load} />}

      <div className="grid gap-3">
        {offers.length === 0 && <p className="text-white/50 text-center py-8">No offers yet.</p>}
        {offers.map((o) => (
          <div key={o.id} className="flex items-center justify-between bg-brand-navy-card border border-white/10 rounded-xl p-4">
            <div>
              <p className="font-semibold text-white">{o.title} · {o.discount_percent}% off</p>
              <p className="text-xs text-white/40">{o.description}</p>
              {o.code && <p className="text-xs text-brand-cyan font-mono mt-1">Code: {o.code}</p>}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => { await supabase.from('offers').update({ active: !o.active }).eq('id', o.id); load(); }}
                className={`px-3 py-1 rounded-full text-xs font-bold ${o.active ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/10 text-white/50'}`}
              >
                {o.active ? 'Active' : 'Inactive'}
              </button>
              <button onClick={async () => { if (confirm('Delete this offer?')) { await supabase.from('offers').delete().eq('id', o.id); load(); } }} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OfferForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', discount_percent: '10', code: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('offers').insert({
      title: form.title,
      description: form.description,
      discount_percent: parseInt(form.discount_percent),
      code: form.code || null,
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-navy-card border border-white/10 rounded-2xl p-6 space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">Add Offer</h3>
        <button type="button" onClick={onClose} className="text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
      </div>
      <div className="space-y-2"><Label className="text-white/70">Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
      <div className="space-y-2"><Label className="text-white/70">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2"><Label className="text-white/70">Discount %</Label><Input required type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
        <div className="space-y-2"><Label className="text-white/70">Code (optional)</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="bg-white/5 border-white/10 text-white" /></div>
      </div>
      <Button type="submit" disabled={saving} className="bg-brand-gradient text-white">{saving ? 'Saving...' : 'Create Offer'}</Button>
    </form>
  );
}
