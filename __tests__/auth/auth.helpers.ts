import { container } from "./../../src/composition-root";
import { WithId } from "mongodb";
import { UserDbType } from "../../src/types/users-types";
import { SessionDbType, SessionTestType } from "../../src/types/sessions-types";
import { DateFnsService } from "../../src/adapters/dateFnsService";
import { UuidService } from "../../src/adapters/uuIdService";
import { UserModel } from "../../src/db/mongodb/repositories/users-repository/user-entitty";
import { SessionsModel } from "../../src/db/mongodb/repositories/sessions-repository/session-entity";

const dateFnsService = container.get(DateFnsService);
const uuIdService = container.get(UuidService);

type RegisterUserPayloadType = {
  login: string;
  pass: string;
  email: string;
  confirmationCode?: string;
  expirationDate?: Date;
  isConfirmed?: boolean;
  recoveryCode?: string;
  recoveryCodeExpirationDate?: Date;
};

export const testSeeder = {
  createUserDto({
    login,
    email,
    pass,
  }: {
    login?: string;
    email?: string;
    pass?: string;
  }) {
    return {
      login: login || "testing",
      email: email || "test@gmail.com",
      pass: pass || "123456789",
    };
  },

  // createUserDtos(count: number) {
  //   const users = [];

  //   for (let i = 0; i <= count; i++) {
  //     users.push({
  //       login: "test" + i,
  //       email: `test${i}@gmail.com`,
  //       pass: "12345678",
  //     });
  //   }
  //   return users;
  // },

  async insertUser({
    login,
    pass,
    email,
    confirmationCode,
    expirationDate,
    isConfirmed,
    recoveryCode,
    recoveryCodeExpirationDate,
  }: RegisterUserPayloadType): Promise<WithId<UserDbType>> {
    const newUser: UserDbType = {
      accountData: {
        login,
        email,
        passHash: pass,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: confirmationCode ?? uuIdService.createRandomCode(),
        expirationDate: expirationDate ?? dateFnsService.addToCurrentDate(),
        isConfirmed: isConfirmed ?? false,
      },
      passwordRecovery: {
        expirationDate:
          recoveryCodeExpirationDate ?? dateFnsService.addToCurrentDate(),
        recoveryCode: recoveryCode ?? uuIdService.createRandomCode(),
      },
    };

    const dbUser = new UserModel(newUser);
    await dbUser.save();

    return {
      _id: dbUser._id,
      ...newUser,
    };
  },

  async insertSession(session: SessionTestType) {
    const { deviceId, device_name, exp, iat, ip, userId } = session;

    const newSession: SessionDbType = {
      userId: userId ?? "testUserId",
      deviceId: deviceId ?? "testDeviceId",
      iat: iat ?? 10,
      exp: exp ?? 10,
      ip: ip ?? "testIp",
      device_name: device_name ?? "testDevice",
    };

    const dbSession = new SessionsModel(newSession);

    await dbSession.save();

    return { id: dbSession.id, ...newSession };
  },
};
