import { compare, hash } from "bcryptjs";

class BcryptService {
  async createHasn(password: string) {
    return hash(password, 8);
  }

  async compareHash(password: string, passHash: string) {
    return compare(password, passHash);
  }
}

export const bcryptService = new BcryptService();
