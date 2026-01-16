import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export default class EmailService {
  public static emailTransporter = () => {
    if (!process.env.EMAIL_SMTP_HOST) {
      console.warn("EMAIL_SMTP_HOST not set. Mocking email transporter.");
      return {
        sendMail: async (mailOptions: any) => {
          console.log("Mock Email Sent:", JSON.stringify(mailOptions, null, 2));
          return Promise.resolve(true);
        },
      } as any;
    }

    return nodemailer.createTransport(
      smtpTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: Number(process.env.EMAIL_SMTP_PORT), // Ports should be a number
        secure: true,
        auth: {
          user: process.env.EMAIL_SMTP_ACCOUNT,
          pass: process.env.EMAIL_SMTP_PASSWORD,
        },
      })
    );
  };
}
