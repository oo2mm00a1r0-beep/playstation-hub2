import { Facebook, Instagram, Phone, Mail } from 'lucide-react';

const SOCIAL = [
  { label: 'Facebook', handle: 'Playstati0n.hub', href: 'https://facebook.com/Playstati0n.hub', icon: Facebook },
  { label: 'Instagram', handle: 'playstation.hub1', href: 'https://instagram.com/playstation.hub1', icon: Instagram },
  { label: 'TikTok', handle: '@playstation_hub', href: 'https://tiktok.com/@playstation_hub', icon: Facebook },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white">Contact Us</h1>
        <p className="text-white/50 mt-2">We&apos;re here to help with any questions about your order or our products</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {SOCIAL.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/10 bg-brand-navy-card p-6 text-center hover:border-brand-cyan/40 transition-colors"
          >
            <div className="inline-flex h-12 w-12 rounded-full bg-brand-gradient items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-white">{s.label}</h3>
            <p className="text-sm text-brand-cyan mt-1">{s.handle}</p>
          </a>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-brand-navy-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">InstaPay / Mobile Wallet</h3>
            <p className="text-lg text-brand-cyan font-bold mt-1">+20 1XX XXX XXXX</p>
            <p className="text-xs text-white/40 mt-1">For manual transfers and payment confirmation</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-navy-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center flex-shrink-0">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Order Support</h3>
            <p className="text-sm text-white/60 mt-1">Reach us via social media for the fastest response.</p>
            <p className="text-xs text-white/40 mt-1">Prepaid orders only · No Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
