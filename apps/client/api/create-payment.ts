import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { Client, Environment } from 'square';
const mollie = require('@mollie/api-client');

// Note: Ces clés devront être ajoutées dans les variables d'environnement Vercel
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: Environment.Sandbox, // Changer en Production pour le live
});

const mollieClient = mollie({ apiKey: process.env.MOLLIE_API_KEY || '' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency, gateway, orderId, metadata } = req.body;

  try {
    switch (gateway) {
      case 'stripe':
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Stripe utilise les centimes
          currency: currency.toLowerCase(),
          metadata: { orderId, ...metadata },
        });
        return res.status(200).json({ clientSecret: paymentIntent.client_secret });

      case 'mollie':
        const payment = await mollieClient.payments.create({
          amount: {
            currency: currency.toUpperCase(),
            value: amount.toFixed(2),
          },
          description: `Commande #${orderId}`,
          redirectUrl: `${process.env.PUBLIC_URL}/commande/confirmation/${orderId}`,
          webhookUrl: `${process.env.PUBLIC_URL}/api/webhooks/mollie`, // À implémenter
          metadata: { orderId },
        });
        return res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });

      case 'square':
        // Pour Square, nous créons un Payment via le SDK client,
        // mais nous pouvons créer un "Order" ou "Payment Link" ici.
        // Pour une intégration "PaymentForm", le client génère un token,
        // et nous créons le paiement réel ici.
        const { sourceId } = req.body;
        const squareResponse = await squareClient.paymentsApi.createPayment({
          sourceId,
          idempotencyKey: crypto.randomUUID(),
          amountMoney: {
            amount: BigInt(Math.round(amount * 100)),
            currency: currency.toUpperCase(),
          },
        });
        return res.status(200).json({ payment: squareResponse.result.payment });

      default:
        return res.status(400).json({ error: 'Gateway not supported' });
    }
  } catch (error: any) {
    console.error('Payment Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
