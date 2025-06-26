import { BcryptService } from "./adapters/bcryptService";
import { DateFnsService } from "./adapters/dateFnsService";
import { JwtService } from "./adapters/jwtService";
import { NodeMailerService } from "./adapters/nodemailer-service";
import { UuidService } from "./adapters/uuIdService";
import { SessionRepository } from "./db/mongodb/repositories/sessions-repository/session-repository";
import { UsersRepository } from "./db/mongodb/repositories/users-repository/users-db-repository";
import { EmailManager } from "./managers/email-manager";
import { AuthService } from "./services/auth-service";
import { UsersService } from "./services/users-service";

const bcryptService = new BcryptService();
const dateFnsService = new DateFnsService();
const jwtService = new JwtService();
const nodeMailerService = new NodeMailerService();
const uuIdService = new UuidService();
const emailManager = new EmailManager(nodeMailerService);

const usersRepository = new UsersRepository();
const sessionsRepository = new SessionRepository();
const usersService = new UsersService();

export const authService = new AuthService(
  usersRepository,
  sessionsRepository,
  usersService,
  bcryptService,
  jwtService,
  uuIdService,
  emailManager,
  dateFnsService
);
