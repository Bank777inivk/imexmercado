import { getDocument, addDocument } from '@imexmercado/firebase';

export interface EmailData {
  customerName: string;
  orderId?: string;
  items?: Array<{ name: string; price: number; quantity: number; image?: string }>;
  totalPrice?: string;
  checkoutUrl?: string;
  retryUrl?: string;
  trackingNumber?: string;
  trackingLink?: string;
}

const DEFAULT_TEMPLATES: Record<string, { subject: string; body: string }> = {
  abandoned_cart: {
    subject: "Votre panier vous attend chez IMEX MERCADO 🛒",
    body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6; border-radius: 24px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0;">Bonjour {customer_name},</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0;">Vous étiez sur le point de commander des articles d'exception chez nous, mais vous n'avez pas finalisé votre achat. Votre panier est sauvegardé et prêt !</p>
  </div>
  <div style="background-color: #F9FAFB; padding: 24px; border-radius: 16px; margin: 25px 0;">
    {cart_items}
  </div>
  <div style="text-align: center; margin-bottom: 40px;">
    <a href="{checkout_url}" style="display: inline-block; background-color: #1F222A; color: #FFFFFF; padding: 16px 36px; border-radius: 14px; font-size: 13px; font-weight: 900; text-decoration: none; text-transform: uppercase;">Finaliser ma commande</a>
  </div>
</div>`
  },
  payment_cancelled: {
    subject: "Problème lors du règlement de votre commande ⚠️",
    body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #EF4444;">Paiement non finalisé</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">Bonjour {customer_name},<br/><br/>Le paiement de votre commande <strong>{order_id}</strong> a échoué ou a été annulé.</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{retry_url}" style="display: inline-block; background-color: #EF4444; color: #FFFFFF; padding: 16px 36px; border-radius: 14px; font-size: 13px; font-weight: 900; text-decoration: none; text-transform: uppercase;">Retenter le paiement</a>
  </div>
</div>`
  },
  order_confirmation: {
    subject: "Merci pour votre commande chez IMEX MERCADO ! 🎉",
    body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #10B981;">Commande confirmée !</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">Bonjour {customer_name},<br/><br/>Nous avons bien reçu votre commande <strong>{order_id}</strong>.</p>
  </div>
  <div style="background-color: #F9FAFB; padding: 24px; border-radius: 16px; margin: 25px 0;">
    {order_items}
    <div style="border-top: 1px solid #E5E7EB; margin-top: 15px; padding-top: 15px; font-weight: 900; text-align: right;">
      Total : {total_price}
    </div>
  </div>
</div>`
  },
  order_shipped: {
    subject: "Bonne nouvelle ! Votre commande {order_id} a été expédiée 🚚",
    body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #3B82F6;">Votre colis est en route !</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">Bonjour {customer_name},<br/><br/>Votre commande <strong>{order_id}</strong> a été remise à notre transporteur.</p>
  </div>
  <div style="background-color: #F3F8FF; border: 1px solid #DBEAFE; padding: 24px; border-radius: 16px; margin: 25px 0; text-align: center;">
    <p style="font-weight: 800; color: #1E40AF; margin-bottom: 10px;">Numéro de suivi : {tracking_number}</p>
    <a href="{tracking_link}" style="display: inline-block; background-color: #3B82F6; color: #FFFFFF; padding: 14px 28px; border-radius: 12px; font-size: 12px; font-weight: 900; text-decoration: none;">Suivre mon colis</a>
  </div>
</div>`
  }
};

export async function sendAutomatedEmail(
  type: 'abandoned_cart' | 'payment_cancelled' | 'order_confirmation' | 'order_shipped',
  recipientEmail: string,
  data: EmailData
) {
  try {
    const emailTemplatesDoc = await getDocument('settings', 'email_templates');
    const template = emailTemplatesDoc?.[type] || DEFAULT_TEMPLATES[type];
    
    let subject = template.subject || DEFAULT_TEMPLATES[type].subject;
    let body = template.body || DEFAULT_TEMPLATES[type].body;

    let itemsHtml = '';
    if (data.items && data.items.length > 0) {
      itemsHtml = `<table style="width: 100%; border-collapse: collapse;">`;
      data.items.forEach(item => {
        itemsHtml += `
          <tr style="border-bottom: 1px solid #F3F4F6;">
            <td style="padding: 10px 0; font-weight: 800; color: #1F222A;">${item.name} <span style="font-weight: 500; color: #6B7280;">x${item.quantity}</span></td>
            <td style="padding: 10px 0; text-align: right; font-weight: 900; color: #1F222A;">${(item.price * item.quantity).toFixed(2)}€</td>
          </tr>
        `;
      });
      itemsHtml += `</table>`;
    }

    const replacements: Record<string, string> = {
      '{customer_name}': data.customerName,
      '{order_id}': data.orderId || '',
      '{total_price}': data.totalPrice || '',
      '{checkout_url}': data.checkoutUrl || '',
      '{retry_url}': data.retryUrl || '',
      '{tracking_number}': data.trackingNumber || '',
      '{tracking_link}': data.trackingLink || '',
      '{cart_items}': itemsHtml,
      '{order_items}': itemsHtml
    };

    Object.keys(replacements).forEach(key => {
      subject = subject.replaceAll(key, replacements[key]);
      body = body.replaceAll(key, replacements[key]);
    });

    await addDocument('email_logs', {
      type,
      recipientEmail,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: 'Sent'
    });

    console.log(`📧 Simulated Admin Email Sent [${type}] to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Error simulating automated email:', error);
    return false;
  }
}
