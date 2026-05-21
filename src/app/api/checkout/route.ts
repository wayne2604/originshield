import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    // Debug log to see if cookies are present
    const allCookies = req.cookies.getAll();
    console.log('Available cookies:', allCookies.map(c => c.name));

    // Try to get the token from cookies
    const token = req.cookies.get("sb-access-token")?.value;

    if (!token) {
      console.error('No auth token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - No session found' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Supabase auth error or user not found:', error?.message);
      return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.nextUrl.origin}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/#pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
