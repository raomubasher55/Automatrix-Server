const nodemailer = require("nodemailer");
// Copy smtp from your logged in mailtrap selecting nodemailer
const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
   
  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL} `,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transport.sendMail(message);
};
module.exports = sendEmail;
