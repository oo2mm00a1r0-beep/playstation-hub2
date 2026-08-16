'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const FALLBACK_IMG = 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=600';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-brand-navy-card transition-all duration-300 hover:border-brand-cyan/40 hover:shadow-xl hover:shadow-brand-cyan/10">
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgError || !product.images?.[0] ? FALLBACK_IMG : product.images[0]}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className={cn(
              'rounded-pill px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md',
              product.condition === 'New' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/10 text-white/70'
            )}>
              {product.condition}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-white truncate hover:text-brand-cyan transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-white/50">{product.console} · {product.category}</p>
        <p className="text-base font-bold text-brand-cyan">EGP {Number(product.price).toLocaleString()}</p>

        <div className="flex gap-2">
          <button
            onClick={() => add(product)}
            className="flex-1 h-9 rounded-lg bg-brand-gradient text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add
          </button>
          <Link
            href={`/product/${product.id}`}
            className="h-9 w-9 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
