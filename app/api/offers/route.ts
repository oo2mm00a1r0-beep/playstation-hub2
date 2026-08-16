import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Offer } from '@/lib/types';

export async function GET() {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Offer[]);
}
