import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from('sell_submissions')
    .insert({
      customer_name: body.customer_name,
      phone: body.phone,
      item_name: body.item_name,
      console: body.console,
      condition: body.condition,
      asking_price: body.asking_price || null,
      notes: body.notes || '',
    })
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
