import { HttpStatuses } from "./../src/types/http-statuses";
import { clearCollections } from "../src/db/mongodb/mongodb";
import { APP_CONFIG } from "../src/settings";
import {
  basicAuth,
  createBlogDto,
  createNewBlogInDb,
  createPostForBlogDto,
  defaultPagination,
  makeIncorrect,
  req,
} from "./test-helpers";
import mongoose from "mongoose";
import { LikeStatuses } from "../src/types/common-types";

describe("/blogs", () => {
  beforeAll(async () => {
    await mongoose.connect(
      APP_CONFIG.MONGO_URL + "/" + APP_CONFIG.TEST_DB_NAME
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log("Connection closed");
  });

  describe("get blogs", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should return all blogs", async () => {
      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.BLOGS)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual(defaultPagination);
    });
  });

  describe("create blog", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should create new blog", async () => {
      const newBlogDto = createBlogDto({});

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS)
        .set(basicAuth)
        .send(newBlogDto)
        .expect(HttpStatuses.Created);

      expect(res.body).toEqual({
        id: expect.any(String),
        name: newBlogDto.name,
        description: newBlogDto.description,
        websiteUrl: newBlogDto.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });

      const response = await req
        .get(APP_CONFIG.MAIN_PATHS.BLOGS)
        .expect(HttpStatuses.Success);

      expect(response.body.items.length).toBe(1);
    });

    it("should not create new blog with incorrect input values", async () => {
      const minInvalidBlogDto = createBlogDto({
        name: "",
        description: "",
        websiteUrl: "daszc",
      });

      const maxInvalidBlogDto = createBlogDto({
        name: "a".repeat(16),
        description: "b".repeat(501),
        websiteUrl: "c".repeat(101),
      });

      await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS)
        .set(basicAuth)
        .send(minInvalidBlogDto)
        .expect(HttpStatuses.BadRequest);

      await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS)
        .set(basicAuth)
        .send(maxInvalidBlogDto)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not create new blog by unauthorized user", async () => {
      const newBlogDto = createBlogDto({});

      await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS)
        .send(newBlogDto)
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("get blog by id", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = "";
    it("should return a blog by id", async () => {
      const blogDb = await createNewBlogInDb();

      blogId = blogDb.id;
      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogDb.id}`)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: blogDb.id,
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it("should not get the blog by the incorrect id", async () => {
      await req
        .get(APP_CONFIG.MAIN_PATHS.BLOGS + "/" + makeIncorrect(blogId))
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("update blog", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = "";

    it("should update the blog", async () => {
      const updatedBlogDto = createBlogDto({
        name: "new-name",
        description: "new-description",
        websiteUrl: "https://new_url",
      });

      const blogDb = await createNewBlogInDb();
      blogId = blogDb.id;

      await req
        .put(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .send(updatedBlogDto)
        .expect(HttpStatuses.NoContent);

      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual({
        id: blogDb.id,
        name: updatedBlogDto.name,
        description: updatedBlogDto.description,
        websiteUrl: updatedBlogDto.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it("should not update the blog with incorrect input values", async () => {
      const minInvalidBlogDto = createBlogDto({
        name: "",
        description: "",
        websiteUrl: "daszc",
      });

      const maxInvalidBlogDto = createBlogDto({
        name: "a".repeat(16),
        description: "b".repeat(501),
        websiteUrl: "c".repeat(101),
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .send(minInvalidBlogDto)
        .expect(HttpStatuses.BadRequest);

      await req
        .put(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .send(maxInvalidBlogDto)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not update not existing blog", async () => {
      const newBlogDto = createBlogDto({
        name: "new_blog_name",
      });

      const res = await req
        .put(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId.slice(0, -2) + "ab"}`)
        .set(basicAuth)
        .send(newBlogDto);

      expect(res.status).toBe(HttpStatuses.NotFound);
    });

    it("should not update the blog with incorrect id", async () => {
      const newBlogDto = createBlogDto({
        name: "new_blog_name",
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.BLOGS + "/22")
        .set(basicAuth)
        .send(newBlogDto)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not update the blog by unauthorized user", async () => {
      const newBlogDto = createBlogDto({
        name: "new_name",
      });

      await req
        .put(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .send(newBlogDto)
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("return all posts for a specific blog", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = "";
    it("should return all posts for a specific blog", async () => {
      const blogDb = await createNewBlogInDb();

      blogId = blogDb.id;

      const res = await req
        .get(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogDb.id}` + "/posts")
        .expect(HttpStatuses.Success);

      expect(res.body).toEqual(defaultPagination);
    });

    it("should not return all posts for a specific blog with incorrect blogId", async () => {
      await req
        .get(APP_CONFIG.MAIN_PATHS.BLOGS + "/22" + "/posts")
        .expect(HttpStatuses.BadRequest);
    });
    it("should not return all posts for not existing blog", async () => {
      await req
        .get(
          APP_CONFIG.MAIN_PATHS.BLOGS +
            `/${blogId.slice(0, -2) + "ab"}` +
            "/posts"
        )
        .expect(HttpStatuses.NotFound);
    });
  });

  describe("create post for a specific blog", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = "";
    it("should create new post for a specific blog", async () => {
      const blogDb = await createNewBlogInDb();
      const newPostDto = createPostForBlogDto({});

      blogId = blogDb.id;

      const res = await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}` + "/posts")
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatuses.Created);

      expect(res.body).toEqual({
        id: expect.any(String),
        title: newPostDto.title,
        shortDescription: newPostDto.shortDescription,
        content: newPostDto.content,
        blogId: blogDb.id,
        blogName: expect.any(String),
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatuses.None,
          newestLikes: [],
        },
      });

      await req
        .get(APP_CONFIG.MAIN_PATHS.POSTS + `/${res.body.id}`)
        .expect(HttpStatuses.Success);
    });

    it("should not create new post for a specific blog with incorrect blogId", async () => {
      const newPostDto = createPostForBlogDto({});

      await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS + "/22/posts")
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not create new post for not existing blog", async () => {
      const newPostDto = createPostForBlogDto({});

      await req
        .post(
          APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId.slice(0, -1) + "a"}/posts`
        )
        .set(basicAuth)
        .send(newPostDto)
        .expect(HttpStatuses.NotFound);
    });

    it("should not create new post for a specific blog with incorrect input values", async () => {
      const invalidPostDtoMin = createPostForBlogDto({
        title: "",
        content: "",
        shortDescription: "",
      });

      const invalidPostDtoMax = createPostForBlogDto({
        title: "a".repeat(31),
        content: "b".repeat(101),
        shortDescription: "c".repeat(1001),
      });

      await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}` + "/posts")
        .set(basicAuth)
        .send(invalidPostDtoMin)
        .expect(HttpStatuses.BadRequest);

      await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}` + "/posts")
        .set(basicAuth)
        .send(invalidPostDtoMax)
        .expect(HttpStatuses.BadRequest);
    });

    it("should not create new post for a specific blog without authorization", async () => {
      const postDto = createPostForBlogDto({});

      await req
        .post(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}` + "/posts")
        .send(postDto)
        .expect(HttpStatuses.Unauthorized);
    });
  });

  describe("delete blog", () => {
    let blogId = "";

    beforeAll(async () => {
      const blogDb = await createNewBlogInDb();
      blogId = blogDb.id;
    });

    afterAll(async () => {
      await clearCollections();
    });

    it("should not delete the blog by unauthorized user", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .expect(HttpStatuses.Unauthorized);
    });

    it("should not delete the blog with incorrect id", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.BLOGS + "/22")
        .set(basicAuth)
        .expect(HttpStatuses.BadRequest);
    });

    it("should delete the blog", async () => {
      await req
        .delete(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NoContent);

      await req
        .delete(APP_CONFIG.MAIN_PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .expect(HttpStatuses.NotFound);
    });
  });
});
