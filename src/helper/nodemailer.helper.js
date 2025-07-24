/** @format */

const smtpConfig = require("../config/smtp.config");
const nodemailer = require("nodemailer");

const BCC = process.env.SMTP_USER;
const REPLY_TO = "CertEd Technologies <info@certed.com>";
const FROM = "CertEd Technologies <noreply@certed.in>";


// Create a Nodemailer transporter for SES
const transporter = nodemailer.createTransport(smtpConfig);

const send = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

const sendEmail = async (
  to = "",
  subject = "",
  body = "",
  attachments = [],
  cc = ""
) => {
  try {
    const mailOptions = {
      from: FROM, 
      to,
      subject,
      text: "",
      html: `<html><body>${body}</html></body>`,
      cc: cc,
      bcc: BCC,
      attachments,
      replyTo: REPLY_TO,
    };
    await send(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendEmail,
};
