CREATE OR REPLACE FUNCTION public.lookup_order_tracking(lookup_value text)
RETURNS TABLE (
  order_id uuid,
  payment_status text,
  items jsonb,
  total numeric,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.payment_status, o.items, o.total, o.created_at
  FROM public.orders AS o
  WHERE nullif(trim(lookup_value), '') IS NOT NULL
    AND (o.id::text = trim(lookup_value) OR o.phone = trim(lookup_value))
  ORDER BY o.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.lookup_order_tracking(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_order_tracking(text) TO anon, authenticated;
