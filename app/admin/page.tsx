'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(`${username}@playstationhub.com`, password);
    if (error) {
      setError('Invalid username or password.');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/atg1.jpg" alt="PlayStation Hub" className="h-16 w-16 rounded-full object-cover object-center ring-2 ring-brand-cyan/40 mb-4 mx-auto -rotate-90" />
        <h1 className="text-2xl font-bold text-white">Admin Login</h1>
        <p className="text-white/50 text-sm mt-1">Sign in to manage the store</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-brand-navy-card border border-white/10 rounded-2xl p-6">
        <div className="space-y-2">
          <Label className="text-white/70">Username</Label>
          <Input required value={username} onChange={(e) => setUsername(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="mohandadmin" />
        </div>
        <div className="space-y-2">
          <Label className="text-white/70">Password</Label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="••••••••" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full h-12 bg-brand-gradient text-white">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
