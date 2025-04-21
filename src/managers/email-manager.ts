import { sendEmailAdapter } from "../adapters/send-email-adapter";

export const emailManager = {
  async sendEmailForRegister(email: string) {
    try {
      const info = await sendEmailAdapter.sendEmail(
        email,
        "hello",
        "first letter"
      );
      return info;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
