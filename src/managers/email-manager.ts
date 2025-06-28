import { inject, injectable } from "inversify";
import { NodeMailerService } from "../adapters/nodemailer-service";

@injectable()
export class EmailManager {
  constructor(
    @inject(NodeMailerService) public nodeMailerService: NodeMailerService
  ) {}

  async sendEmailForRegistration(email: string, confirmationCode: string) {
    return this.nodeMailerService.sendEmail({
      email,
      subject: "registration for blog platform",
      message: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`,
    });
  }

  async sendEmailForPasswordRecovery(email: string, recoveryCode: string) {
    return this.nodeMailerService.sendEmail({
      email,
      subject: "registration for blog platform",
      message: `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`,
    });
  }
}
