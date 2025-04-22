import { nodeMailerService } from "../adapters/nodemailer-service";

export const emailManager = {
  async sendEmailForRegistration(email: string) {
    try {
      const info = await nodeMailerService.sendEmail({
        email,
        subject: "registration for blog platform",
        message: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
        </p>`,
      });
      return info;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
