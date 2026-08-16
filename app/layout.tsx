import './globals.css';
import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import CartDrawer from '@/components/cart-drawer';
import PageTransition from '@/components/page-transition';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PlayStation Hub — Consoles, Games & Retro Gaming',
  description: 'Buy and sell PlayStation consoles, games, accessories, and retro gaming items across Egypt.',
  icons: {
    icon: '/atg1.jpg',
    apple: '/atg1.jpg',
  },
  openGraph: {
    title: 'PlayStation Hub',
    description: 'Buy and sell PlayStation consoles, games, accessories, and retro gaming items across Egypt.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={tajawal.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <CartProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-24">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CartDrawer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
