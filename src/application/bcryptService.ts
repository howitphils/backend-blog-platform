import bcrypt from "bcryptjs/umd/types";

export const bcryptService = {
  async createHasn(password: string) {
    return bcrypt.hash(password, 8);
  },

  async compareHash(password: string, passHash: string) {
    return bcrypt.compare(password, passHash);
  },
};
