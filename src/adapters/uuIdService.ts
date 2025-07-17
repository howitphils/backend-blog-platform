import { v4 } from "uuid";

export const uuidService = {
  createRandomCode() {
    return v4();
  },
};
