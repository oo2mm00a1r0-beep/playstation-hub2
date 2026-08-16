import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: body.customer_name,
      phone: body.phone,
      governorate: body.governorate,
      address: body.address,
      items: body.items,
      total: body.total,
      payment_status: body.payment_status || 'Pending',
    })
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
