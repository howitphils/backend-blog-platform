import { WithId } from "mongodb";
import { UserDbType } from "../../src/types/users-types";
import { SessionDbType, SessionTestType } from "../../src/types/sessions-types";
import { UserModel } from "../../src/db/mongodb/repositories/users-repository/user-entitty";
import {
  Comment,
  CommentsModel,
} from "../../src/db/mongodb/repositories/comments-repository/comments-entity";
import { CommentTestType } from "../../src/types/comments-types";
import { uuidService } from "../../src/adapters/uuIdService";
import { dateFnsService } from "../../src/adapters/dateFnsService";
import { SessionModel } from "../../src/db/mongodb/repositories/sessions-repository/session-entity";

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
  //   const users: UserInputModel[] = [];

  //   for (let i = 0; i <= count; i++) {
  //     users.push({
  //       login: "test" + i,
  //       email: `test${i}@gmail.com`,
  //       password: "12345678",
  //     });
  //   }
  //   return users;
  // },

  // async insertUsers(count: number) {
  //   const users: WithId<UserDbType>[] = [];
  //   const userDtos = testSeeder.createUserDtos(count);
  //   for (const userDto of userDtos) {
  //     const newUser = await testSeeder.insertUser({
  //       login: userDto.login,
  //       email: userDto.email,
  //       pass: userDto.password,
  //     });
  //     users.push(newUser);
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
        confirmationCode: confirmationCode ?? uuidService.createRandomCode(),
        expirationDate: expirationDate ?? dateFnsService.addToCurrentDate(),
        isConfirmed: isConfirmed ?? false,
      },
      passwordRecovery: {
        expirationDate:
          recoveryCodeExpirationDate ?? dateFnsService.addToCurrentDate(),
        recoveryCode: recoveryCode ?? uuidService.createRandomCode(),
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

    const dbSession = new SessionModel(newSession);

    await dbSession.save();

    return { id: dbSession.id, ...newSession };
  },

  async insertComment(comment: CommentTestType) {
    const { postId, content, commentatorInfo } = comment;

    const newComment: Comment = {
      postId: postId || "testPostId",
      content: content || "Test comment content",
      createdAt: new Date().toISOString(),
      commentatorInfo: commentatorInfo || {
        userId: "testUserId",
        userLogin: "testUserLogin",
      },
      likesCount: 0,
      dislikesCount: 0,
    };

    const dbComment = new CommentsModel(newComment);

    await dbComment.save();

    return { id: dbComment.id, ...newComment };
  },
};
