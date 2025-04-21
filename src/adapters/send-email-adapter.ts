import nodemailer from "nodemailer";

export const sendEmailAdapter = {
  async sendEmail(email: string, message: string, subject: string) {
    const transporter = nodemailer.createTransport({
      service: "mail.ru",
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Hello 👻" ${process.env.NODEMAILER_USERNAME}`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });

    return info;
  },
};
