'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/Playstati0n.hub' },
  { label: 'Instagram', href: 'https://instagram.com/playstation.hub1' },
  { label: 'TikTok', href: 'https://tiktok.com/@playstation_hub' },
];

export default function Footer() {
  const pathname = usePathname();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, [pathname]);

  return (
    <footer key={key} className="mt-24 border-t border-white/10 bg-brand-navy-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/atg1.jpg" alt="PlayStation Hub" className="h-16 w-16 rounded-full object-cover object-center ring-2 ring-brand-cyan/40 mb-4 -rotate-90" />
            <p className="text-sm text-white/50 leading-relaxed">
              Your destination for PlayStation consoles, games, accessories, and retro gaming in Egypt.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/consoles" className="hover:text-brand-cyan">Consoles</Link></li>
              <li><Link href="/games" className="hover:text-brand-cyan">Games</Link></li>
              <li><Link href="/accessories" className="hover:text-brand-cyan">Accessories</Link></li>
              <li><Link href="/retro" className="hover:text-brand-cyan">Retro Gaming</Link></li>
              <li><Link href="/offers" className="hover:text-brand-cyan">Offers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/sell" className="hover:text-brand-cyan">Sell Your Device</Link></li>
              <li><Link href="/shipping" className="hover:text-brand-cyan">Shipping</Link></li>
              <li><Link href="/contact" className="hover:text-brand-cyan">Contact Us</Link></li>
              <li><Link href="/admin" className="hover:text-brand-cyan">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-white/50">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan">
                    {s.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <p className="text-xs text-white/40">InstaPay / Wallet</p>
                <p className="text-sm text-white/70 font-medium">+20 1XX XXX XXXX</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} PlayStation Hub. All rights reserved.</p>
          <p className="text-xs text-white/40">Prepaid orders only · Shipping across Egypt</p>
        </div>
      </div>
    </footer>
  );
}
