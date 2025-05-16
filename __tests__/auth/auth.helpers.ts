import { WithId } from "mongodb";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { usersCollection } from "../../src/db/mongodb/mongodb";
import { UserDbType } from "../../src/types/users-types";

type RegisterUserPayloadType = {
  login: string;
  pass: string;
  email: string;
  code?: string;
  expirationDate?: Date;
  isConfirmed?: boolean;
};

export const testSeeder = {
  createUserDto() {
    return {
      login: "testing",
      email: "test@gmail.com",
      pass: "123456789",
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
    };

    const res = await usersCollection.insertOne({ ...newUser });
    return {
      _id: res.insertedId,
      ...newUser,
    };
  },
};
