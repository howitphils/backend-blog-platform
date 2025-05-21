import { compare, hash } from "bcryptjs";

export const bcryptService = {
  async createHasn(password: string) {
    return hash(password, 8);
  },

  async compareHash(password: string, passHash: string) {
    return compare(password, passHash);
  },
};
