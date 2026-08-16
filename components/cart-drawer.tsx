'use client';

import { useCart } from '@/lib/cart';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { items, isOpen, close, remove, setQuantity, total, count } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-brand-navy-card border-l border-white/10 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-cyan" />
            <h2 className="text-lg font-bold text-white">Your Cart ({count})</h2>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-white/30" />
            </div>
            <p className="text-white/50">Your cart is empty</p>
            <Button
              onClick={close}
              className="bg-brand-gradient text-white hover:opacity-90"
              asChild
            >
              <Link href="/consoles">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-white/5 rounded-xl p-3 border border-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{item.product.name}</h3>
                    <p className="text-xs text-white/50">{item.product.console} · {item.product.condition}</p>
                    <p className="text-sm font-bold text-brand-cyan mt-1">
                      EGP {Number(item.product.price).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                        className="h-7 w-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-medium text-white w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(item.product.id)}
                        className="ml-auto p-1.5 rounded-md text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Subtotal</span>
                <span className="text-xl font-bold text-white">EGP {total.toLocaleString()}</span>
              </div>
              <Button className="w-full bg-brand-gradient text-white hover:opacity-90 h-12 text-base" asChild>
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
