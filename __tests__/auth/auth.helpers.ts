import { WithId } from "mongodb";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import {
  sessionsCollection,
  usersCollection,
} from "../../src/db/mongodb/mongodb";
import { UserDbType } from "../../src/types/users-types";
import { SessionDbType, SessionTestType } from "../../src/types/sessions-types";

type RegisterUserPayloadType = {
  login: string;
  pass: string;
  email: string;
  code?: string;
  expirationDate?: Date;
  isConfirmed?: boolean;
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
    code,
    expirationDate,
    isConfirmed,
  }: RegisterUserPayloadType): Promise<WithId<UserDbType>> {
    const newUser: UserDbType = {
      accountData: {
        login,
        email,
        passHash: pass,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: code ?? randomUUID(),
        expirationDate:
          expirationDate ??
          add(new Date(), {
            minutes: 30,
          }),
        isConfirmed: isConfirmed ?? false,
      },
      usedTokens: [],
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
