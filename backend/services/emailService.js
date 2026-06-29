const nodemailer = require('nodemailer');

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Simple wrapper to send OTP email
async function sendOtp(email, otp) {
  const expiration = process.env.OTP_EXPIRATION_MINUTES || 10;
  const mailOptions = {
    from: `"TutorConnect Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is ${otp}. It will expire in ${expiration} minutes.`
  };

  // Send mail and return result (or throw on error)
  return transporter.sendMail(mailOptions);
}

module.exports = { sendOtp };
