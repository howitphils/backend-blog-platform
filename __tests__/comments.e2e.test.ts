import { APP_CONFIG } from "../src/settings";
import {
  clearCollections,
  createCommentInDb,
  createContentDto,
  getTokenPair,
  jwtAuth,
  makeIncorrect,
  req,
} from "./test-helpers";
import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { HttpStatuses } from "../src/types/http-statuses";
import { UserViewModel } from "../src/types/users-types";

describe("/comments", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(APP_CONFIG.MONGO_URL, APP_CONFIG.TEST_DB_NAME);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("get comment by id", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let commentId = "";
    let user = {} as UserViewModel;

    it("should return a comment by id", async () => {
      const commentInfo = await createCommentInDb();

      commentId = commentInfo.comment.id;
      user = commentInfo.user;

      const res = await req
        .get(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: commentId,
        content: commentInfo.comment.content,
        commentatorInfo: {
          userId: user.id,
          userLogin: user.login,
        },
        createdAt: expect.any(String),
      });
    });

    it("should not return a comment by incorrect id", async () => {
      await req
        .get(APP_CONFIG.PATHS.COMMENTS + "/22")
        .expect(HttpStatuses.BadRequest);
    });

    it("should not return a not existing comment", async () => {
      await req
        .get(APP_CONFIG.PATHS.COMMENTS + "/" + makeIncorrect(commentId))
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("update the comment", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let commentId = "";
    let token = "";

    it("should update the comment", async () => {
      const commentInfo = await createCommentInDb();
      const updatedCommentDto = createContentDto({
        content: "a".repeat(21),
      });

      commentId = commentInfo.comment.id;
      token = commentInfo.token;

      await req
        .put(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(updatedCommentDto)
        .expect(HttpStatuses.NoContent);

      const res = await req
        .get(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: commentId,
        content: updatedCommentDto.content,
        commentatorInfo: {
          userId: commentInfo.user.id,
          userLogin: commentInfo.user.login,
        },
        createdAt: expect.any(String),
      });
    });

    it("should not update the comment with incorrect body", async () => {
      const invalidContentDtoMin = createContentDto({
        content: "a".repeat(19),
      });

      const invalidContentDtoMax = createContentDto({
        content: "a".repeat(301),
      });

      await req
        .put(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(invalidContentDtoMin)
        .expect(HttpStatuses.BadRequest);

      await req
        .put(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(invalidContentDtoMax)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not update the comment for unauthorized user", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      await req
        .put(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .send(contentDto)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not update the comment by another user", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      const token2 = (await getTokenPair()).accessToken;

      await req
        .put(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token2))
        .send(contentDto)
        .expect(HttpStatuses.Forbidden);
    });

    it("should not update not existing comment", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      await req
        .put(APP_CONFIG.PATHS.COMMENTS + "/" + makeIncorrect(commentId))
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatuses.NotFound);
    });

    it("should not update comment by incorrect id", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      await req
        .put(APP_CONFIG.PATHS.COMMENTS + "/22")
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatuses.BadRequest);
    });
  });

  describe("delete the comment", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let commentId = "";
    let token = "";

    it("should not delete the comment by unauthorized user", async () => {
      const commentInfo = await createCommentInDb();

      commentId = commentInfo.comment.id;
      token = commentInfo.token;

      await req
        .delete(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not delete the comment by another user", async () => {
      const token2 = (await getTokenPair()).accessToken;

      await req
        .delete(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token2))
        .expect(HttpStatuses.Forbidden);
    });

    it("should not delete the comment by incorrect id", async () => {
      await req
        .delete(APP_CONFIG.PATHS.COMMENTS + "/22")
        .set(jwtAuth(token))
        .expect(HttpStatuses.BadRequest);
    });

    it("should delete the comment", async () => {
      await req
        .delete(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.NoContent);

      await req
        .delete(APP_CONFIG.PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.NotFound);
    });
  });
});
