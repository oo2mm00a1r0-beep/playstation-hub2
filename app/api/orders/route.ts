import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderId = crypto.randomUUID();
  const payload: Record<string, unknown> = {
    id: orderId,
    customer_name: body.customer_name,
    phone: body.phone,
    governorate: body.governorate,
    address: body.address,
    items: body.items,
    total: body.total,
    payment_status: body.payment_status || 'Pending',
  };

  if (body.payment_method) payload.payment_method = body.payment_method;
  if (body.reference_number !== undefined && body.reference_number !== null) {
    payload.reference_number = body.reference_number;
  }

  const { error } = await supabase
    .from('orders')
    .insert(payload);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    id: orderId,
    reference_number: body.reference_number ?? null,
  });
}
