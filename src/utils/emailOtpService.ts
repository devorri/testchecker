import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_6edxlbw';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_p1nlko5';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '-1ihLys3f_2wXY-zh';

export interface SendOtpResult {
  success: boolean;
  code: string;
  error?: string;
}

/**
 * Sends a real 6-digit OTP code to the recipient email via EmailJS.
 * Matches template variables: {{passcode}}, {{time}}, and recipient email.
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
    recipient: recipientEmail
  };

  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('EmailJS OTP sent successfully:', res.status, res.text);
    return {
      success: true,
      code
    };
  } catch (err: any) {
    console.warn('EmailJS error sending OTP:', err);
    // Even if EmailJS has network or quota error, return code so testing does not break
    return {
      success: false,
      code,
      error: err?.text || err?.message || 'Failed to dispatch email'
    };
  }
}
