const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

async function sendTenantInviteEmail(to, inviteUrl) {
  const mailOptions = {
    from: `"MyPropertyPal" <hello@mypropertypal.com>`, 
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