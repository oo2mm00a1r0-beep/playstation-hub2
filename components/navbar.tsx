'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Shield, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/consoles', label: 'Consoles' },
  { href: '/games', label: 'Games' },
  { href: '/accessories', label: 'Accessories' },
  { href: '/retro', label: 'Retro' },
  { href: '/offers', label: 'Offers' },
  { href: '/sell', label: 'Sell Your Device' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          'mx-auto max-w-6xl rounded-pill transition-all duration-300',
          'bg-brand-navy-card/80 backdrop-blur-xl border border-white/10',
          scrolled ? 'shadow-2xl shadow-black/50' : 'shadow-lg shadow-black/20'
        )}
      >
        <div className="flex items-center justify-between px-4 py-2.5 gap-4">
          <button
            className="lg:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('nav-link', isActive(link.href) && 'active')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="flex-shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/atg1.jpg"
              alt="PlayStation Hub"
              className="h-11 w-11 rounded-full object-cover object-center ring-2 ring-brand-cyan/40 -rotate-90"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6 flex-1 justify-start">
            {NAV_LINKS.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('nav-link', isActive(link.href) && 'active')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/admin"
              className="p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Admin"
            >
              <Shield className="h-5 w-5" />
            </Link>
            <button
              onClick={open}
              className="relative p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-brand-gradient text-[10px] font-bold flex items-center justify-center text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden px-4 pb-4 pt-2 border-t border-white/10 mt-2">
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-brand-gradient text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
