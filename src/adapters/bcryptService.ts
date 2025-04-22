import bcrypt from "bcryptjs";

export const bcryptService = {
  async createHasn(password: string) {
    return bcrypt.hash(password, 8);
  },

  async compareHash(password: string, passHash: string) {
    return bcrypt.compare(password, passHash);
  },
};
