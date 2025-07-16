import { APP_CONFIG } from "../src/settings";
import {
  basicAuth,
  clearCollections,
  createContentDto,
  createNewBlogInDb,
  createNewUserInDb,
  createPostDto,
  createPostInDbHelper,
  createUserDto,
  defaultPagination,
  getTokenPair,
  jwtAuth,
  makeIncorrect,
  req,
} from "./test-helpers";
import { HttpStatuses } from "../src/types/http-statuses";
import mongoose from "mongoose";
import { LikeStatuses } from "../src/types/common-types";

describe("/posts", () => {
  beforeAll(async () => {
    await mongoose.connect(
      APP_CONFIG.MONGO_URL + "/" + APP_CONFIG.TEST_DB_NAME
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log("Connection closed");
  });

  describe("get posts", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return all posts", async () => {
      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual(defaultPagination);
    });
  });

  describe("get comments for a post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return all comments for a post", async () => {
      const dbPost = await createPostInDbHelper();

      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + `/${dbPost.id}` + "/comments")
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual(defaultPagination);
    });
  });

  describe("create comment for a post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let token = "";
    let postId = "";

    it("should return a new comment", async () => {
      const userDto = createUserDto({});
      const dbUser = await createNewUserInDb(userDto);
      const dbPost = await createPostInDbHelper();
      const contentDto = createContentDto({});

      token = (await getTokenPair(userDto)).accessToken;

      postId = dbPost.id;

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatuses.Created);

      expect(res.body).toEqual({
        id: expect.any(String),
        content: contentDto.content,
        commentatorInfo: {
          userId: dbUser.id,
          userLogin: dbUser.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
        },
      });
    });

    it("should not create a new comment with incorrect body", async () => {
      const contentDtoMin = createContentDto({ content: "d".repeat(19) });
      const contentDtoMax = createContentDto({ content: "d".repeat(301) });

      await req
        .post(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDtoMin)
        .expect(HttpStatuses.BadRequest);

      await req
        .post(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDtoMax)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not create a new comment for unauthorized user", async () => {
      const contentDto = createContentDto({});

      await req
        .post(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}` + "/comments")
        .send(contentDto)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not create a new comment for not existing post", async () => {
      const contentDto = createContentDto({});

      await req
        .post(
          APP_CONFIG.MAIN_PATHS.POSTS +
            `/${makeIncorrect(postId)}` +
            "/comments"
        )
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("create post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = "";
    it("should create new post", async () => {
      const blogDb = await createNewBlogInDb();
      blogId = blogDb.id;

      const newPostDto = createPostDto({ blogId });

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatuses.Created);

      expect(res.body).toEqual({
        id: expect.any(String),
        title: newPostDto.title,
        shortDescription: newPostDto.shortDescription,
        content: newPostDto.content,
        blogId: blogDb.id,
        blogName: blogDb.name,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });

      const postsRes = await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS)
        .expect(HttpStatuses.Success);

      expect(postsRes.body.items.length).toBe(1);
    });

    it("should not create new post with incorrect input values", async () => {
      const newPostDto = createPostDto({
        blogId: blogId,
        content: "a".repeat(31),
        shortDescription: "b".repeat(101),
        title: "c".repeat(1001),
      });

      await req
        .post(APP_CONFIG.MAIN_PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not create new post by unauthorized user", async () => {
      const newPostDto = createPostDto({ blogId });

      await req
        .post(APP_CONFIG.MAIN_PATHS.POSTS)
        .send(newPostDto)
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("get post by id", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let postId = "";

    it("should return a post by id", async () => {
      const postDb = await createPostInDbHelper();
      postId = postDb.id;

      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: postDb.id,
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });
    });

    it("should not return a post by incorrect id", async () => {
      await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + "/22")
        .expect(HttpStatuses.BadRequest);
    });

    it("should not return a not existing post", async () => {
      await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + "/" + makeIncorrect(postId))
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("update post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let postId = "";
    let blogId = "";

    it("should update the post", async () => {
      const postDb = await createPostInDbHelper();

      postId = postDb.id;
      blogId = postDb.blogId;

      const updatedPostDto = createPostDto({
        blogId: postDb.blogId,
        content: "new-content",
        title: "new-title",
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatuses.NoContent);

      const updatedPostRes = await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatuses.Success);

      expect(updatedPostRes.body).toEqual({
        id: postDb.id,
        title: updatedPostDto.title,
        content: updatedPostDto.content,
        shortDescription: postDb.shortDescription,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });
    });

    it("should not update the post with incorrect input values", async () => {
      const invalidPostDtoMin = createPostDto({
        blogId: blogId,
        content: "",
        title: "",
        shortDescription: "",
      });

      const invalidPostDtoMax = createPostDto({
        blogId: blogId,
        content: "a".repeat(31),
        title: "b".repeat(101),
        shortDescription: "c".repeat(1001),
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(invalidPostDtoMin)
        .expect(HttpStatuses.BadRequest);

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(invalidPostDtoMax)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not update the post by incorrect id", async () => {
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: "new",
        title: "new",
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + "/22")
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatuses.BadRequest);
    });
    it("should not update not existing post", async () => {
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: "new",
        title: "new",
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId.slice(0, -2) + "bc"}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatuses.NotFound);
    });

    it("should not update the post by unauthorized user", async () => {
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: "new",
        title: "new",
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .send(updatedPostDto)
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("delete post", () => {
    let postId = "";

    beforeAll(async () => {
      const postDb = await createPostInDbHelper();
      postId = postDb.id;
    });

    afterAll(async () => {
      await clearCollections();
    });

    it("should not delete the post by unauthorized user", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not delete the post by incorrect id", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.POSTS + "/22")
        .set(basicAuth)
        .expect(HttpStatuses.BadRequest);
    });

    it("should delete the post", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NoContent);

      await req
        .delete(APP_CONFIG.MAIN_PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("update post's like status", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should update post's like status", async () => {
      const userDto = createUserDto({
        email: "user1@gmail.com",
        login: "user1login",
      });
      const dbUser = await createNewUserInDb(userDto);
      const postDb = await createPostInDbHelper();
      const token = (await getTokenPair(userDto)).accessToken;

      const res = await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postDb.id}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: LikeStatuses.Like });

      console.log(res.body);
      expect(res.status).toBe(HttpStatuses.NoContent);

      const updatedPostRes = await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + `/${postDb.id}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(updatedPostRes.body.extendedLikesInfo).toEqual({
        dislikesCount: 0,
        likesCount: 1,
        myStatus: LikeStatuses.Like,
        newestLikes: [
          {
            addedAt: expect.any(String),
            userId: dbUser.id,
            login: dbUser.login,
          },
        ],
      });
    });

    it("should return empty newestLikes array when like status is changed", async () => {
      const userDto = createUserDto({});
      await createNewUserInDb(userDto);
      const postDb = await createPostInDbHelper();
      const token = (await getTokenPair(userDto)).accessToken;

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postDb.id}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: LikeStatuses.Like })
        .expect(HttpStatuses.NoContent);

      await req
        .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postDb.id}/like-status`)
        .set(jwtAuth(token))
        .send({ likeStatus: LikeStatuses.Dislike })
        .expect(HttpStatuses.NoContent);

      // await req
      //   .put(APP_CONFIG.MAIN_PATHS.POSTS + `/${postDb.id}/like-status`)
      //   .set(jwtAuth(token))
      //   .send({ likeStatus: LikeStatuses.None })
      //   .expect(HttpStatuses.NoContent);

      const postLikeRes = await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + `/${postDb.id}`)
        .set(jwtAuth(token))
        .expect(HttpStatuses.Success);

      expect(postLikeRes.body).toEqual({
        id: postDb.id,
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 1,
          likesCount: 0,
          myStatus: LikeStatuses.Dislike,
          newestLikes: [],
        },
      });
    });

    // TODO:
    // create 6 posts then
    // like post 1 by user 1, user 2;
    //   like post 2 by user 2, user 3;
    //   dislike post 3 by user 1;
    //   like post 4 by user 1, user 4, user 2, user 3;
    //   like post 5 by user 2, dislike by user 3;
    //   like post 6 by user 1, dislike by user 2.
    //   Get the posts by user 1 after all likes
  });
});
