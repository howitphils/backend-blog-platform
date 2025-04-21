import nodemailer from "nodemailer";

export const sendEmailAdapter = {
  async sendEmail(email: string, message: string, subject: string) {
    const transporter = nodemailer.createTransport({
      service: "mail.ru",
      auth: {
        user: "vladislavgromyko@mail.ru",
        pass: "1839567vlad",
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <vladislavgromyko@mail.ru>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });

    console.log("Message sent: %s", info.messageId);

    return info;
  },
};
