import { WithId } from "mongodb";
import {
  sessionsCollection,
  usersCollection,
} from "../../src/db/mongodb/mongodb";
import { UserDbType } from "../../src/types/users-types";
import { SessionDbType, SessionTestType } from "../../src/types/sessions-types";
import { uuIdService } from "../../src/adapters/uuIdService";
import { dateFnsService } from "../../src/adapters/dateFnsService";

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

    const res = await usersCollection.insertOne({ ...newUser });
    return {
      _id: res.insertedId,
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

    await sessionsCollection.insertOne({ ...newSession });

    return newSession;
  },
};
