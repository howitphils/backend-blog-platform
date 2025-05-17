import nodemailer from "nodemailer";

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
    const transporter = nodemailer.createTransport({
      service: "mail.ru",
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Blog platform back 👻" ${process.env.NODEMAILER_USERNAME}`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
  },
};
