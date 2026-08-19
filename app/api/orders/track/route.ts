import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const lookupValue = typeof body.lookup === 'string' ? body.lookup.trim() : '';

  if (!lookupValue) {
    return NextResponse.json({ error: 'Enter an Order ID or phone number.' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('lookup_order_tracking', {
    lookup_value: lookupValue,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'No order matched that Order ID or phone number.' }, { status: 404 });
  }

  return NextResponse.json({ orders: data });
}
