import { v4 } from "uuid";

export const uuIdService = {
  createRandomCode() {
    return v4();
  },
};
