import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_6edxlbw';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_p1nlko5';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '-1ihLys3f_2wXY-zh';

export interface SendOtpResult {
  success: boolean;
  code?: string;
  error?: string;
}

/**
 * Sends a real 6-digit OTP code to the recipient's real email inbox via EmailJS.
 * Maps exact template variables: {{passcode}}, {{time}}, and recipient email.
 */
export async function sendEmailOtp(recipientEmail: string): Promise<SendOtpResult> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 15 minutes expiration time
  const expiryDate = new Date(Date.now() + 15 * 60 * 1000);
  const timeString = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const templateParams = {
    passcode: code,
    time: timeString,
    to_email: recipientEmail,
    email: recipientEmail,
    user_email: recipientEmail,
    recipient: recipientEmail,
    to_name: recipientEmail.split('@')[0],
    reply_to: recipientEmail
  };

  try {
    // Initialize EmailJS with public key
    emailjs.init({ publicKey: PUBLIC_KEY });

    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY
    });

    console.log('[EmailJS] OTP email successfully dispatched:', res.status, res.text);
    return {
      success: true,
      code
    };
  } catch (err: any) {
    const errorMsg = err?.text || err?.message || 'Failed to dispatch email via EmailJS';
    console.error('[EmailJS] Error sending OTP email:', err);
    return {
      success: false,
      error: errorMsg
    };
  }
}
