import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const consoleFilter = searchParams.get('console');
  const condition = searchParams.get('condition');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || 'newest';
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const q = searchParams.get('q');

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'available');

  if (category && category !== 'All') query = query.eq('category', category);
  if (consoleFilter && consoleFilter !== 'All') query = query.eq('console', consoleFilter);
  if (condition && condition !== 'All') query = query.eq('condition', condition);
  if (minPrice) query = query.gte('price', parseFloat(minPrice));
  if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
  if (q) query = query.ilike('name', `%${q}%`);

  if (sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data as Product[]);
}
