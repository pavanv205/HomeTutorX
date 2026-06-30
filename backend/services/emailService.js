const nodemailer = require('nodemailer');

// Simple wrapper to send OTP email
async function sendOtp(email, otp) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Check if SMTP is configured
  const isSmtpConfigured = host && user && pass;

  if (!isSmtpConfigured) {
    console.log('\x1b[33m%s\x1b[0m', '\n================== [SMTP CONSOLE FALLBACK] ==================');
    console.log(`To:      ${email}`);
    console.log(`Subject: Password Reset OTP Request`);
    console.log(`OTP:     ${otp}`);
    console.log('------------------------------------------------------------');
    console.log(`Your OTP for password reset is ${otp}. It will expire in 10 minutes.`);
    console.log('\x1b[33m%s\x1b[0m', '=============================================================\n');
    return { success: true, mode: 'console' };
  }

  // Create transporter dynamically using environment variables
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const fromName = process.env.FROM_NAME || 'TutorConnect Support';
  const fromEmail = process.env.FROM_EMAIL || process.env.FROM_MAIL || user;
  const expiration = process.env.OTP_EXPIRATION_MINUTES || 10;
  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is ${otp}. It will expire in ${expiration} minutes.`
  };

  // Send mail and return result (or throw on error)
  return transporter.sendMail(mailOptions);
}

module.exports = { sendOtp };
