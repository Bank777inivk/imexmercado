import { getDocument, addDocument } from "@imexmercado/firebase";

export interface EmailData {
  customerName: string;
  orderId?: string;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalPrice?: string;
  checkoutUrl?: string;
  retryUrl?: string;
  trackingNumber?: string;
  trackingLink?: string;
}

const DEFAULT_TEMPLATES: Record<"fr" | "pt", Record<string, { subject: string; body: string }>> = {
  fr: {
    abandoned_cart: {
      subject: "Votre panier vous attend chez IMEX MERCADO 🛒",
      body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6; border-radius: 24px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0;">Bonjour {customer_name},</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0;">Vous étiez sur le point de commander des articles d'exception chez nous, mais vous n'avez pas finalisé votre achat. Votre panier is sauvegardé et prêt !</p>
  </div>
  <div style="background-color: #F9FAFB; padding: 24px; border-radius: 16px; margin: 25px 0;">
    {cart_items}
  </div>
  <div style="text-align: center; margin-bottom: 40px;">
    <a href="{checkout_url}" style="display: inline-block; background-color: #1F222A; color: #FFFFFF; padding: 16px 36px; border-radius: 14px; font-size: 13px; font-weight: 900; text-decoration: none; text-transform: uppercase;">Finaliser ma commande</a>
  </div>
</div>`,
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
</div>`,
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
</div>`,
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
</div>`,
    },
  },
  pt: {
    abandoned_cart: {
      subject: "O seu carrinho está à sua espera na IMEX MERCADO 🛒",
      body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6; border-radius: 24px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0;">Olá {customer_name},</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0;">Esteve quase a encomendar artigos excecionais connosco, mas não finalizou a sua compra. O seu carrinho está guardado e pronto!</p>
  </div>
  <div style="background-color: #F9FAFB; padding: 24px; border-radius: 16px; margin: 25px 0;">
    {cart_items}
  </div>
  <div style="text-align: center; margin-bottom: 40px;">
    <a href="{checkout_url}" style="display: inline-block; background-color: #1F222A; color: #FFFFFF; padding: 16px 36px; border-radius: 14px; font-size: 13px; font-weight: 900; text-decoration: none; text-transform: uppercase;">Finalizar a minha encomenda</a>
  </div>
</div>`,
    },
    payment_cancelled: {
      subject: "Problema no pagamento da sua encomenda ⚠️",
      body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #EF4444;">Pagamento não finalizado</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">Olá {customer_name},<br/><br/>O pagamento da sua encomenda <strong>{order_id}</strong> falhou ou foi cancelado.</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{retry_url}" style="display: inline-block; background-color: #EF4444; color: #FFFFFF; padding: 16px 36px; border-radius: 14px; font-size: 13px; font-weight: 900; text-decoration: none; text-transform: uppercase;">Tentar novamente</a>
  </div>
</div>`,
    },
    order_confirmation: {
      subject: "Obrigado pela sua encomenda na IMEX MERCADO ! 🎉",
      body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #10B981;">Encomenda confirmada!</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">Olá {customer_name},<br/><br/>Recebemos com sucesso a sua encomenda <strong>{order_id}</strong>.</p>
  </div>
  <div style="background-color: #F9FAFB; padding: 24px; border-radius: 16px; margin: 25px 0;">
    {order_items}
    <div style="border-top: 1px solid #E5E7EB; margin-top: 15px; padding-top: 15px; font-weight: 900; text-align: right;">
      Total: {total_price}
    </div>
  </div>
</div>`,
    },
    order_shipped: {
      subject: "Boa notícia! A sua encomenda {order_id} foi enviada 🚚",
      body: `<div style="font-family: 'Outfit', 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #1F222A; border: 1px solid #F3F4F6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; margin: 0; color: #1F222A;"><span style="color: #FBBF24;">I</span>MEX MERCADO</h1>
  </div>
  <div>
    <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #3B82F6;">A sua encomenda está a caminho!</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">Olá {customer_name},<br/><br/>A sua encomenda <strong>{order_id}</strong> foi entregue à transportadora.</p>
  </div>
  <div style="background-color: #F3F8FF; border: 1px solid #DBEAFE; padding: 24px; border-radius: 16px; margin: 25px 0; text-align: center;">
    <p style="font-weight: 800; color: #1E40AF; margin-bottom: 10px;">Número de rastreio: {tracking_number}</p>
    <a href="{tracking_link}" style="display: inline-block; background-color: #3B82F6; color: #FFFFFF; padding: 14px 28px; border-radius: 12px; font-size: 12px; font-weight: 900; text-decoration: none;">Seguir encomenda</a>
  </div>
</div>`,
    },
  },
};

export async function sendAutomatedEmail(
  type:
    | "abandoned_cart"
    | "payment_cancelled"
    | "order_confirmation"
    | "order_shipped",
  recipientEmail: string,
  data: EmailData,
  lang?: "fr" | "pt",
) {
  try {
    // Determine language (defaults to "pt", attempts to read from pathname if client-side)
    let currentLang: "fr" | "pt" = lang || "pt";
    if (!lang && typeof window !== "undefined" && window.location) {
      const pathLang = window.location.pathname.split("/")[1];
      if (pathLang === "fr" || pathLang === "pt") {
        currentLang = pathLang;
      }
    }

    // 1. Get templates from settings
    const emailTemplatesDoc = await getDocument("settings", "email_templates");
    const templateKey = `${type}_${currentLang}`;
    const template = emailTemplatesDoc?.[templateKey] || emailTemplatesDoc?.[type] || DEFAULT_TEMPLATES[currentLang][type];

    let subject = template.subject || DEFAULT_TEMPLATES[currentLang][type].subject;
    let body = template.body || DEFAULT_TEMPLATES[currentLang][type].body;

    // 2. Format items HTML if provided
    let itemsHtml = "";
    if (data.items && data.items.length > 0) {
      itemsHtml = `<table style="width: 100%; border-collapse: collapse;">`;
      data.items.forEach((item) => {
        itemsHtml += `
          <tr style="border-bottom: 1px solid #F3F4F6;">
            <td style="padding: 10px 0; font-weight: 800; color: #1F222A;">${item.name} <span style="font-weight: 500; color: #6B7280;">x${item.quantity}</span></td>
            <td style="padding: 10px 0; text-align: right; font-weight: 900; color: #1F222A;">${(item.price * item.quantity).toFixed(2)}€</td>
          </tr>
        `;
      });
      itemsHtml += `</table>`;
    }

    // 3. Replace placeholders
    const replacements: Record<string, string> = {
      "{customer_name}": data.customerName,
      "{order_id}": data.orderId || "",
      "{total_price}": data.totalPrice || "",
      "{checkout_url}":
        data.checkoutUrl || window.location.origin + "/checkout",
      "{retry_url}":
        data.retryUrl || window.location.origin + "/checkout?retry=true",
      "{tracking_number}": data.trackingNumber || "",
      "{tracking_link}": data.trackingLink || "",
      "{cart_items}": itemsHtml,
      "{order_items}": itemsHtml,
    };

    Object.keys(replacements).forEach((key) => {
      subject = subject.replaceAll(key, replacements[key]);
      body = body.replaceAll(key, replacements[key]);
    });

    // Call serverless API to send real SMTP email via Nodemailer
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          subject,
          body,
        }),
      });
    } catch (apiErr) {
      console.warn(
        "Failed to dispatch real email via Vercel serverless API:",
        apiErr,
      );
    }

    // 4. Log to email_logs in Firestore
    await addDocument("email_logs", {
      type,
      recipientEmail,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: "Sent",
    });

    // 5. Dispatch standard browser event for simulated UI toast
    const event = new CustomEvent("simulated-email-sent", {
      detail: {
        type,
        recipientEmail,
        subject,
        body,
      },
    });
    window.dispatchEvent(event);

    console.log(`📧 Simulated Email Sent [${type}] to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error("Error simulating automated email:", error);
    return false;
  }
}
