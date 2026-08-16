'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gamepad2, Headphones, Phone, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';

const HERO_IMAGE = 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=1200';
const PROMO_LEFT_IMAGE = 'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=800';
const PROMO_RIGHT_IMAGE = 'https://images.pexels.com/photos/596750/pexels-photo-596750.jpeg?auto=compress&cs=tinysrgb&w=800';

const CATEGORIES = [
  { name: 'Consoles', href: '/consoles', image: 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=600', icon: Gamepad2 },
  { name: 'Sell Your Device', href: '/sell', image: 'https://images.pexels.com/photos/10389703/pexels-photo-10389703.jpeg?auto=compress&cs=tinysrgb&w=600', icon: Store },
  { name: 'Games', href: '/games', image: 'https://images.pexels.com/photos/7915356/pexels-photo-7915356.jpeg?auto=compress&cs=tinysrgb&w=600', icon: Sparkles },
  { name: 'Accessories', href: '/accessories', image: 'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=600', icon: Headphones },
  { name: 'Contact Us', href: '/contact', image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600', icon: Phone },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products?limit=8');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-8 pb-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className={`inline-flex items-center gap-2 rounded-pill bg-white/5 border border-white/10 px-4 py-1.5 text-sm text-white/70 ${animate ? 'animate-fade-up' : 'opacity-0'}`}>
              <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
              Egypt&apos;s PlayStation Marketplace
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] ${animate ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <span className="block text-white">Level up your</span>
              <span className="block text-brand-gradient">gaming experience</span>
            </h1>
            <p className={`text-lg text-white/60 max-w-xl ${animate ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              Shop new and used PlayStation consoles, games, and accessories. Trade in your old device. Delivered across all Egypt.
            </p>
            <div className={`flex flex-wrap gap-3 ${animate ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <Button asChild className="bg-brand-gradient text-white hover:opacity-90 h-12 px-6 text-base rounded-pill">
                <Link href="/consoles">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/5 h-12 px-6 text-base rounded-pill">
                <Link href="/sell">Sell Your Device</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className={`relative ${animate ? 'animate-pop-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-brand-gradient rounded-full blur-3xl opacity-30 animate-pulse-glow" />
              <div className="relative aspect-square rounded-full overflow-hidden border border-white/10 animate-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_IMAGE} alt="PlayStation Console" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className={`hidden lg:block absolute -left-12 top-8 w-44 ${animate ? 'animate-slide-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
              <PromoCard image={PROMO_LEFT_IMAGE} title="DualSense Controller" href="/accessories" />
            </div>
            <div className={`hidden lg:block absolute -right-12 bottom-8 w-44 ${animate ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <PromoCard image={PROMO_RIGHT_IMAGE} title="Pro Accessories" href="/accessories" />
            </div>
          </div>
        </div>
      </section>

      {/* Category quick links */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-brand-navy-card ${animate ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.9 + i * 0.08}s` }}
            >
              <div className="aspect-[4/5] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <cat.icon className="h-5 w-5 text-brand-cyan mb-1.5" />
                  <p className="text-sm font-bold text-white">{cat.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest products */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Latest Products</h2>
          <Link href="/consoles" className="text-sm text-brand-cyan hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-white/50 text-center py-12">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PromoCard({ image, title, href }: { image: string; title: string; href: string }) {
  return (
    <Link href={href} className="block rounded-2xl overflow-hidden border border-white/10 bg-brand-navy-card group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={title} className="h-24 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="p-3">
        <p className="text-xs font-bold text-white truncate">{title}</p>
        <p className="text-[10px] text-brand-cyan mt-0.5 flex items-center gap-1">
          Shop now <ArrowRight className="h-3 w-3" />
        </p>
      </div>
    </Link>
  );
}
