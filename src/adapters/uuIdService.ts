import { v4 } from "uuid";

export class UuidService {
  createRandomCode() {
    return v4();
  }
}
