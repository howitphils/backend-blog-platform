import { v4 } from "uuid";

class UuidService {
  createRandomCode() {
    return v4();
  }
}

export const uuIdService = new UuidService();
