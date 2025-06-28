import { injectable } from "inversify";
import { v4 } from "uuid";

@injectable()
export class UuidService {
  createRandomCode() {
    return v4();
  }
}
