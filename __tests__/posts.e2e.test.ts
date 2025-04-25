// import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
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
  getAccessToken,
  jwtAuth,
  makeIncorrect,
  req,
} from "./test-helpers";
import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { HttpStatuses } from "../src/types/http-statuses";

describe("/posts", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearCollections();
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  describe("get posts", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return all posts", async () => {
      const res = await req
        .get(SETTINGS.PATHS.POSTS)
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
        .get(SETTINGS.PATHS.POSTS + `/${dbPost.id}` + "/comments")
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

      token = await getAccessToken(userDto);

      postId = dbPost.id;

      const res = await req
        .post(SETTINGS.PATHS.POSTS + `/${postId}` + "/comments")
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
      });
    });

    it("should not create a new comment with incorrect body", async () => {
      const contentDtoMin = createContentDto({ content: "d".repeat(19) });
      const contentDtoMax = createContentDto({ content: "d".repeat(301) });

      await req
        .post(SETTINGS.PATHS.POSTS + `/${postId}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDtoMin)
        .expect(HttpStatuses.BadRequest);

      await req
        .post(SETTINGS.PATHS.POSTS + `/${postId}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDtoMax)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not create a new comment for unauthorized user", async () => {
      const contentDto = createContentDto({});

      await req
        .post(SETTINGS.PATHS.POSTS + `/${postId}` + "/comments")
        .send(contentDto)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not create a new comment for not existing post", async () => {
      const contentDto = createContentDto({});

      await req
        .post(SETTINGS.PATHS.POSTS + `/${makeIncorrect(postId)}` + "/comments")
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
        .post(SETTINGS.PATHS.POSTS)
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
      });

      const postsRes = await req
        .get(SETTINGS.PATHS.POSTS)
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
        .post(SETTINGS.PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatuses.BadRequest);
    });

    // it("should not create new post with incorrect blogId", async () => {
    //   const newPostDto = createPostDto({
    //     blogId: "28",
    //   });

    //   await req
    //     .post(SETTINGS.PATHS.POSTS)
    //     .set(basicAuth)
    //     .send(newPostDto)
    //     .expect(HttpStatuses.BadRequest);
    // });

    it("should not create new post by unauthorized user", async () => {
      const newPostDto = createPostDto({ blogId });

      await req
        .post(SETTINGS.PATHS.POSTS)
        .send(newPostDto)
        .expect(HttpStatuses.Unauthorized);
    });

    // it("should not create new post if blog does not exist", async () => {
    //   await clearCollections();

    //   const newPostDto = createPostDto({
    //     blogId,
    //   });

    //   await req
    //     .post(SETTINGS.PATHS.POSTS)
    //     .set(basicAuth)
    //     .send(newPostDto)
    //     .expect(HttpStatuses.NotFound);
    // });
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
        .get(SETTINGS.PATHS.POSTS + `/${postId}`)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: postDb.id,
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: expect.any(String),
      });
    });

    it("should not return a post by incorrect id", async () => {
      await req
        .get(SETTINGS.PATHS.POSTS + "/22")
        .expect(HttpStatuses.BadRequest);
    });

    it("should not return a not existing post", async () => {
      await req
        .get(SETTINGS.PATHS.POSTS + "/" + makeIncorrect(postId))
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
        .put(SETTINGS.PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(HttpStatuses.NoContent);

      const updatedPostRes = await req
        .get(SETTINGS.PATHS.POSTS + `/${postId}`)
        .expect(HttpStatuses.Success);

      expect(updatedPostRes.body).toEqual({
        id: postDb.id,
        title: updatedPostDto.title,
        content: updatedPostDto.content,
        shortDescription: postDb.shortDescription,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: expect.any(String),
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
        .put(SETTINGS.PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(invalidPostDtoMin)
        .expect(HttpStatuses.BadRequest);

      await req
        .put(SETTINGS.PATHS.POSTS + `/${postId}`)
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
        .put(SETTINGS.PATHS.POSTS + "/22")
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
        .put(SETTINGS.PATHS.POSTS + `/${postId.slice(0, -2) + "bc"}`)
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
        .put(SETTINGS.PATHS.POSTS + `/${postId}`)
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
        .delete(SETTINGS.PATHS.POSTS + `/${postId}`)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not delete the post by incorrect id", async () => {
      await req
        .delete(SETTINGS.PATHS.POSTS + "/22")
        .set(basicAuth)
        .expect(HttpStatuses.BadRequest);
    });

    it("should delete the post", async () => {
      await req
        .delete(SETTINGS.PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NoContent);

      await req
        .delete(SETTINGS.PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NotFound);
    });
  });
});
