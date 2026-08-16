'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { CONSOLES } from '@/lib/types';

const CONDITIONS = ['New', 'Used'] as const;
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function Catalog({ category, title, subtitle }: { category?: string; title: string; subtitle: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [consoleFilter, setConsoleFilter] = useState('All');
  const [condition, setCondition] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (q) params.set('q', q);
      if (consoleFilter !== 'All') params.set('console', consoleFilter);
      if (condition !== 'All') params.set('condition', condition);
      params.set('minPrice', String(priceRange[0]));
      params.set('maxPrice', String(priceRange[1]));
      params.set('sort', sort);
      try {
        const res = await fetch(`/api/products?${params}`);
        if (res.ok) setProducts(await res.json());
      } catch {}
      setLoading(false);
    }
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [category, q, consoleFilter, condition, priceRange, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">{title}</h1>
        <p className="text-white/50 mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="bg-brand-navy-card border border-white/10 rounded-2xl p-5 space-y-5 sticky top-28">
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="font-bold text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="h-5 w-5 text-white/60" /></button>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">Console</label>
              <Select value={consoleFilter} onValueChange={setConsoleFilter}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-brand-navy-card border-white/10">
                  <SelectItem value="All">All Consoles</SelectItem>
                  {CONSOLES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">Condition</label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-brand-navy-card border-white/10">
                  <SelectItem value="All">All</SelectItem>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">
                Price: EGP {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
              </label>
              <Slider
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                min={0}
                max={50000}
                step={500}
                className="py-2"
              />
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 gap-3">
            <Button
              variant="outline"
              className="lg:hidden border-white/20 text-white"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-white/50 hidden sm:inline">Sort:</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-brand-navy-card border-white/10">
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/50 text-lg">No products found.</p>
              <p className="text-white/30 text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
