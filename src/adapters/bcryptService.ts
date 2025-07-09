import { compare, hash } from "bcryptjs";
import { injectable } from "inversify";

@injectable()
export class BcryptService {
  async createHash(password: string) {
    return hash(password, 8);
  }

  async compareHash(password: string, passHash: string) {
    return compare(password, passHash);
  }
}
