import { createTransport } from "nodemailer";
import { APP_CONFIG } from "../settings";

export class NodeMailerService {
  async sendEmail({
    email,
    message,
    subject,
  }: {
    email: string;
    subject: string;
    message: string;
  }) {
    console.log("Email will be sent");

    const transporter = createTransport({
      service: APP_CONFIG.NODEMAILER_MAIL_SERVICE,
      auth: {
        // sender credentials
        user: APP_CONFIG.NODEMAILER_USERNAME,
        pass: APP_CONFIG.NODEMAILER_PASS,
      },
    });

    transporter.sendMail({
      from: `"Blog platform back 👻" ${APP_CONFIG.NODEMAILER_USERNAME}`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
  }
}
