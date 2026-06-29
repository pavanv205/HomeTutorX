const nodemailer = require('nodemailer');

/**
 * Reusable utility to send emails via SMTP (using Nodemailer).
 * If SMTP configuration is missing, it falls back to console logging.
 * 
 * @param {Object} options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content of the email
 * @param {string} [options.text] - Plain text fallback of the email
 */
const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  const fromEmail = process.env.FROM_EMAIL || 'noreply@tutorconnect.com';
  const fromName = process.env.FROM_NAME || 'TutorConnect';

  // Check if SMTP is configured
  const isSmtpConfigured = host && user && pass;

  if (!isSmtpConfigured) {
    console.log('\x1b[33m%s\x1b[0m', '\n================== [SMTP CONSOLE FALLBACK] ==================');
    console.log(`To:      ${options.email}`);
    console.log(`From:    "${fromName}" <${fromEmail}>`);
    console.log(`Subject: ${options.subject}`);
    console.log('------------------------------------------------------------');
    console.log(options.text || 'HTML Content (rendered in console):');
    console.log(options.html);
    console.log('\x1b[33m%s\x1b[0m', '=============================================================\n');
    return { success: true, mode: 'console' };
  }

  // Create SMTP transporter
  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465, // true for port 465, false for other ports
    auth: {
      user,
      pass,
    },
    // We can also accept self-signed certificates in local development
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.text || 'TutorConnect Email Notification',
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] Email successfully sent to ${options.email} | MessageID: ${info.messageId}`);
    return { success: true, mode: 'smtp', messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email to ${options.email}:`, error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = sendEmail;
