'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Check, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const FALLBACK_IMG = 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { add, open } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setProduct(d))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-white/5 rounded animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
            <div className="h-20 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-white/50 text-lg">Product not found.</p>
        <Button asChild className="mt-4 bg-brand-gradient text-white">
          <Link href="/consoles">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images
    : [FALLBACK_IMG];

  const getImage = (i: number) => imgErrors.has(i) ? FALLBACK_IMG : images[i];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/consoles" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-brand-navy-card bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImage(activeImage)}
              alt={product.name}
              onError={() => setImgErrors(prev => new Set(prev).add(activeImage))}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors',
                    activeImage === i ? 'border-brand-cyan' : 'border-white/10'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImage(i)}
                    alt=""
                    onError={() => setImgErrors(prev => new Set(prev).add(i))}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex gap-2">
            <span className={cn(
              'rounded-pill px-3 py-1 text-xs font-bold',
              product.condition === 'New' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/10 text-white/70'
            )}>
              {product.condition}
            </span>
            <span className="rounded-pill px-3 py-1 text-xs font-bold bg-white/10 text-white/70">
              {product.console}
            </span>
            <span className="rounded-pill px-3 py-1 text-xs font-bold bg-white/10 text-white/70">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white">{product.name}</h1>

          <p className="text-3xl font-bold text-brand-gradient">
            EGP {Number(product.price).toLocaleString()}
          </p>

          <p className="text-white/60 leading-relaxed">{product.description}</p>

          {product.status === 'sold' ? (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
              <p className="text-red-400 font-bold">This item has been sold</p>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => { add(product); }}
                className="flex-1 h-12 bg-brand-gradient text-white hover:opacity-90 text-base"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button
                onClick={() => { add(product); open(); }}
                className="flex-1 h-12 bg-white text-brand-navy hover:bg-white/90 text-base"
              >
                Buy Now
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Check className="h-4 w-4 text-brand-cyan" /> Genuine product guarantee
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Tag className="h-4 w-4 text-brand-cyan" /> Prepaid orders only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
