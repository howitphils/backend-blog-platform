// import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import {
  basicAuth,
  createContentDto,
  createNewBlogInDb,
  createNewUserInDb,
  createPostDto,
  createPostDtobHelper,
  createPostInDbHelper,
  defaultPagination,
  getAccessToken,
  jwtAuth,
  req,
} from "./test-helpers";
import { MongoClient } from "mongodb";
import { clearCollections, runDb } from "../src/db/mongodb/mongodb";

describe("/posts", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  beforeEach(async () => {
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
      const res = await req.get(SETTINGS.PATHS.POSTS).expect(200);

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
        .get(SETTINGS.PATHS.POSTS + `${dbPost.id}` + "/comments")
        .expect(200);

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
      const dbPost = await createPostInDbHelper();
      const dbUser = await createNewUserInDb();
      const contentDto = createContentDto();

      token = await getAccessToken(dbUser);
      postId = dbPost.id;

      const res = await req
        .post(SETTINGS.PATHS.POSTS + `${postId}` + "/comments")
        .set(jwtAuth(token))
        .send({ content: "content" })
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        content: contentDto,
        commentatorInfo: {
          userId: dbUser.id,
          userLogin: dbUser.login,
        },
        createdAt: expect.any(String),
      });
    });

    it("should not create a new comment with incorrect body", async () => {
      const contentDtoMin = createContentDto("d".repeat(19));
      const contentDtoMax = createContentDto("d".repeat(301));

      await req
        .post(SETTINGS.PATHS.POSTS + `${postId}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDtoMin)
        .expect(400);

      await req
        .post(SETTINGS.PATHS.POSTS + `${postId}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDtoMax)
        .expect(400);
    });

    it("should not create a new comment for unauthorized user", async () => {
      const contentDto = createContentDto();

      await req
        .post(SETTINGS.PATHS.POSTS + `${postId}` + "/comments")
        .send(contentDto)
        .expect(401);
    });

    it("should not create a new comment for not existing post", async () => {
      const contentDto = createContentDto();

      await req
        .post(SETTINGS.PATHS.POSTS + `${postId + 12}` + "/comments")
        .set(jwtAuth(token))
        .send(contentDto)
        .expect(404);
    });
  });

  describe("create post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should create new post", async () => {
      const blogDb = await createNewBlogInDb();
      const newPostDto = createPostDto({ blogId: blogDb.id });

      const res = await req
        .post(SETTINGS.PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        title: newPostDto.title,
        shortDescription: newPostDto.shortDescription,
        content: newPostDto.content,
        blogId: blogDb.id,
        blogName: blogDb.name,
        createdAt: expect.any(String),
      });

      const postsRes = await req.get(SETTINGS.PATHS.POSTS).expect(200);

      expect(postsRes.body.items.length).toBe(1);
    });

    it("should not create new post with incorrect input values", async () => {
      const blogDb = await createNewBlogInDb();
      const newPostDto = createPostDto({
        blogId: blogDb.id,
        content: "",
        shortDescription: "",
      });

      await req
        .post(SETTINGS.PATHS.POSTS)
        .set(basicAuth)
        .send(newPostDto)
        .expect(400);
    });

    it("should not create new post by unauthorized user", async () => {
      const newPostDto = createPostDtobHelper();

      await req.post(SETTINGS.PATHS.POSTS).send(newPostDto).expect(401);
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
        .get(SETTINGS.PATHS.POSTS + `/${postId}`)
        .expect(200);

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
      await req.get(SETTINGS.PATHS.POSTS + `/${postId + 21}`).expect(404);
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
        .expect(204);

      const updatedPostRes = await req
        .get(SETTINGS.PATHS.POSTS + `/${postId}`)
        .expect(200);

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
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: "",
        title: "",
      });

      await req
        .put(SETTINGS.PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(400);
    });

    it("should not update the post by incorrect id", async () => {
      const updatedPostDto = createPostDto({
        blogId: blogId,
        content: "new",
        title: "new",
      });

      await req
        .put(SETTINGS.PATHS.POSTS + `/${blogId + 22}`)
        .set(basicAuth)
        .send(updatedPostDto)
        .expect(404);
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
        .expect(401);
    });
  });

  describe("delete post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let postId = "";

    it("should not delete the post by unauthorized user", async () => {
      const postDb = await createPostInDbHelper();
      postId = postDb.id;

      await req.delete(SETTINGS.PATHS.POSTS + `/${postId}`).expect(401);
    });

    it("should not delete the post by incorrect id", async () => {
      await req
        .delete(SETTINGS.PATHS.POSTS + `/${postId + 22}`)
        .set(basicAuth)
        .expect(404);
    });

    it("should delete the post", async () => {
      const res = await req
        .delete(SETTINGS.PATHS.POSTS + `/${postId}`)
        .set(basicAuth)
        .expect(204);

      console.log(res.body);

      await req.get(SETTINGS.PATHS.POSTS + `/${postId}`).expect(404);
    });
  });
});
