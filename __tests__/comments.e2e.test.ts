import { APP_CONFIG } from "../src/settings";
import {
  clearCollections,
  createCommentInDb,
  createContentDto,
  defaultPagination,
  getTokenPair,
  jwtAuth,
  makeIncorrect,
  req,
} from "./test-helpers";

import { HttpStatuses } from "../src/types/http-statuses";
import { UserViewModel } from "../src/types/users-types";
import mongoose from "mongoose";

describe("/comments", () => {
  beforeAll(async () => {
    await mongoose.connect(
      APP_CONFIG.MONGO_URL + "/" + APP_CONFIG.TEST_DB_NAME
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log("Connection closed");
  });

  describe("get comment by id", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let commentId = "";
    let user = {} as UserViewModel;
    let token = "";

    it("should return a comment by id", async () => {
      const commentInfo = await createCommentInDb();

      commentId = commentInfo.comment.id;
      user = commentInfo.user;
      token = commentInfo.token;

      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: commentId,
        content: commentInfo.comment.content,
        commentatorInfo: {
          userId: user.id,
          userLogin: user.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: commentInfo.comment.likesInfo.likesCount,
          dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
          myStatus: commentInfo.comment.likesInfo.myStatus || "None",
        },
      });
    });

    it("should not return a comment by incorrect id", async () => {
      await req
        .get(APP_CONFIG.MAIN_PATHS.COMMENTS + "/22")
        .set(jwtAuth(token))
        .expect(HttpStatuses.BadRequest);
    });

    it("should not return a not existing comment", async () => {
      await req
        .get(APP_CONFIG.MAIN_PATHS.COMMENTS + "/" + makeIncorrect(commentId))
        .set(jwtAuth(token))
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("get comments for a post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return all comments for a post", async () => {
      const commentInfo = await createCommentInDb();

      const res = await req
        .get(
          APP_CONFIG.MAIN_PATHS.POSTS + `/${commentInfo.postId}` + "/comments"
        )
        .set(jwtAuth(commentInfo.token))
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        ...defaultPagination,
        pagesCount: 1,
        totalCount: 1,
        items: [
          {
            id: commentInfo.comment.id,
            content: commentInfo.comment.content,
            commentatorInfo: {
              userId: commentInfo.user.id,
              userLogin: commentInfo.user.login,
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: commentInfo.comment.likesInfo.likesCount,
              dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
              myStatus: commentInfo.comment.likesInfo.myStatus,
            },
          },
        ],
      });
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
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(updatedCommentDto)
        .expect(HttpStatuses.NoContent);

      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: commentId,
        content: updatedCommentDto.content,
        commentatorInfo: {
          userId: commentInfo.user.id,
          userLogin: commentInfo.user.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: commentInfo.comment.likesInfo.likesCount,
          dislikesCount: commentInfo.comment.likesInfo.dislikesCount,
          myStatus: commentInfo.comment.likesInfo.myStatus || "None",
        },
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
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(invalidContentDtoMin)
        .expect(HttpStatuses.BadRequest);

      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .send(invalidContentDtoMax)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not update the comment for unauthorized user", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .send(contentDto)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not update the comment by another user", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      const token2 = (await getTokenPair()).accessToken;

      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token2))
        .send(contentDto)
        .expect(HttpStatuses.Forbidden);
    });

    it("should not update not existing comment", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + "/" + makeIncorrect(commentId))
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatuses.NotFound);
    });

    it("should not update comment by incorrect id", async () => {
      const contentDto = createContentDto({
        content: "a".repeat(20),
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + "/22")
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
        .delete(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not delete the comment by another user", async () => {
      const token2 = (await getTokenPair()).accessToken;

      await req
        .delete(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token2))
        .expect(HttpStatuses.Forbidden);
    });

    it("should not delete the comment by incorrect id", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.COMMENTS + "/22")
        .set(jwtAuth(token))
        .expect(HttpStatuses.BadRequest);
    });

    it("should delete the comment", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.NoContent);

      await req
        .delete(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("update comment's like status", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let commentId = "";
    let token = "";

    it("should update comment status with like", async () => {
      const commentInfo = await createCommentInDb();

      commentId = commentInfo.comment.id;
      token = commentInfo.token;

      const res = await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: "Like" })
        .expect(HttpStatuses.NoContent);

      expect(res.body).toEqual({});

      const commentRes = await req
        .get(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(commentRes.body.likesInfo.myStatus).toBe("Like");
      expect(commentRes.body.likesInfo.likesCount).toBe(1);
      expect(commentRes.body.likesInfo.dislikesCount).toBe(0);
    });

    it("should update comment like status with dislike", async () => {
      const res = await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: "Dislike" })
        .expect(HttpStatuses.NoContent);

      expect(res.body).toEqual({});

      const commentRes = await req
        .get(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(commentRes.body.likesInfo.myStatus).toBe("Dislike");
      expect(commentRes.body.likesInfo.likesCount).toBe(0);
      expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    });

    it("should not update comment like status with the same status in request", async () => {
      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: "Dislike" })
        .expect(HttpStatuses.NoContent);

      const commentRes = await req
        .get(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(commentRes.body.likesInfo.myStatus).toBe("Dislike");
      expect(commentRes.body.likesInfo.likesCount).toBe(0);
      expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    });

    it("should return an error if like status is incorrect", async () => {
      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: "Incorrect" })
        .expect(HttpStatuses.BadRequest);
    });

    it("should not update comment like status for unauthorized user", async () => {
      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + `/${commentId}/like-status`)
        .send({ likeStatus: "Like" })
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not update comment like status if comment does not exist", async () => {
      await req
        .put(
          APP_CONFIG.MAIN_PATHS.COMMENTS +
            `/${makeIncorrect(commentId)}/like-status`
        )
        .set(jwtAuth(token))
        .send({ likeStatus: "Like" })
        .expect(HttpStatuses.NotFound);
    });

    it("should not update comment like status by incorrect id", async () => {
      await req
        .put(APP_CONFIG.MAIN_PATHS.COMMENTS + "/22/like-status")
        .set(jwtAuth(token))
        .send({ likeStatus: "Like" })
        .expect(HttpStatuses.BadRequest);
    });
  });
});
