import { createTransport } from "nodemailer";
import { SETTINGS } from "../settings";

export const nodeMailerService = {
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
      service: SETTINGS.NODEMAILER_MAIL_SERVICE,
      auth: {
        user: SETTINGS.NODEMAILER_USERNAME,
        pass: SETTINGS.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Blog platform back 👻" ${SETTINGS.NODEMAILER_USERNAME}`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
  },
};
