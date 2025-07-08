const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER, // set in your .env file
    pass: process.env.EMAIL_PASS, // set in your .env file
  },
});

async function sendTenantInviteEmail(to, inviteUrl) {
  const mailOptions = {
    from: `"MyPropertyPal" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You're invited to join MyPropertyPal as a tenant",
    html: `
      <p>Your landlord has invited you to join MyPropertyPal.</p>
      <p>Click the link below to set up your account:</p>
      <a href="${inviteUrl}">${inviteUrl}</a>
      <p>If you did not expect this email, you can ignore it.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendTenantInviteEmail };