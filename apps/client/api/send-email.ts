import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientEmail, subject, body } = req.body;

  if (!recipientEmail || !subject || !body) {
    return res.status(400).json({ error: 'Missing recipientEmail, subject, or body' });
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"IMEX MERCADO" <${user}>`;

  if (!host || !user || !pass) {
    console.error('SMTP configuration missing in environment variables');
    return res.status(500).json({ 
      error: 'SMTP configuration missing', 
      detail: 'Please configure SMTP_HOST, SMTP_USER, SMTP_PASS in Vercel settings.' 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from,
      to: recipientEmail,
      subject,
      html: body
    });

    console.log('Message sent: %s', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
