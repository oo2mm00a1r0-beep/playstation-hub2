import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { order_id, success, payment_status, payment_method, reference_number } = await req.json();

  const update: Record<string, unknown> = {};

  if (typeof success === 'boolean') {
    update.payment_status = success ? 'Paid' : 'Failed';
  }

  if (payment_status) {
    update.payment_status = payment_status;
  }

  if (payment_method) {
    update.payment_method = payment_method;
  }

  if (reference_number !== undefined) {
    update.reference_number = reference_number || null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No update payload provided' }, { status: 400 });
  }

  const { error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', order_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
