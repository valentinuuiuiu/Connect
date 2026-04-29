import { NextResponse } from 'next/server';
import Stripe from 'stripe';

let stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: Request) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is not defined' },
        { status: 500 }
      );
    }

    const { model, packageId, amount } = await req.json();

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      invoice_creation: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Avans Înmatriculare - ${model}`,
              description: `Pachet ${packageId || 'Standard'}. Avans pentru rezervarea locului în următorul lot.`,
            },
            unit_amount: amount ? amount * 100 : 60000, // Amount in cents (600 EUR by default)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
