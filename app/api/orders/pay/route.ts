import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { order_id, success } = await req.json();

  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: success ? 'Paid' : 'Failed' })
    .eq('id', order_id)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  return NextResponse.json(data);
}
