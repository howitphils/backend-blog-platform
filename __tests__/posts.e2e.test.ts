// import { db } from "./../src/db/mongodb/mongo";
import { SETTINGS } from "../src/settings";
import {
  basicAuth,
  createNewBlogInDb,
  createNewPostInDb,
  createPostDto,
  createPostDtobHelper,
  createPostInDbHelper,
  defaultPagination,
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

    it("should return all blogs", async () => {
      const res = await req.get(SETTINGS.PATHS.BLOGS).expect(200);

      expect(res.body).toEqual(defaultPagination);
    });
  });

  describe("create post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    it("should create new blog", async () => {
      const newBlogDto = createBlogDto({});

      const res = await req
        .post(SETTINGS.PATHS.BLOGS)
        .set(basicAuth)
        .send(newBlogDto)
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        name: newBlogDto.name,
        description: newBlogDto.description,
        websiteUrl: newBlogDto.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });

      const response = await req.get(SETTINGS.PATHS.BLOGS).expect(200);

      expect(response.body.items.length).toBe(1);
    });

    it("should not create new blog with incorrect input values", async () => {
      const newBlogDto = createBlogDto({
        name: "",
      });

      await req
        .post(SETTINGS.PATHS.BLOGS)
        .set(basicAuth)
        .send(newBlogDto)
        .expect(400);
    });

    it("should not create new blog by unauthorized user", async () => {
      const newBlogDto = createBlogDto({});

      await req.post(SETTINGS.PATHS.BLOGS).send(newBlogDto).expect(401);
    });
  });

  describe("get post by id", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = "";
    it("should return a blog by id", async () => {
      const blogDb = await createNewBlogInDb();
      blogId = blogDb.id;

      const res = await req
        .get(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`)
        .expect(200);

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
      await req.get(SETTINGS.PATHS.BLOGS + `/${blogId + 22}`).expect(404);
    });
  });

  describe("update post", () => {
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
        .put(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`)
        .set(basicAuth)
        .send(updatedBlogDto)
        .expect(204);

      const res = await req
        .get(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`)
        .expect(200);

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
      const newBlogDto = createBlogDto({
        name: "",
      });

      await req
        .put(SETTINGS.PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .send(newBlogDto)
        .expect(400);
    });

    it("should not update the blog with incorrect id", async () => {
      const newBlogDto = createBlogDto({
        name: "new_blog_name",
      });

      await req
        .put(SETTINGS.PATHS.BLOGS + `/${blogId + 22}`)
        .set(basicAuth)
        .send(newBlogDto)
        .expect(404);
    });

    it("should not update the blog by unauthorized user", async () => {
      const newBlogDto = createBlogDto({
        name: "new_name",
      });

      await req
        .put(SETTINGS.PATHS.BLOGS + `/${blogId}`)
        .send(newBlogDto)
        .expect(401);
    });
  });

  // describe("return all posts for a specific blog", () => {
  //   afterAll(async () => {
  //     await clearCollections();
  //   });

  //   it("should return all posts for a specific blog", async () => {
  //     const blogDb = await createNewBlogInDb();

  //     const res = await req
  //       .get(SETTINGS.PATHS.BLOGS + `/${blogDb.id}` + "/posts")
  //       .expect(200);

  //     expect(res.body).toEqual(defaultPagination);
  //   });

  //   it("should not return all posts for a specific blog with incorrect blogId", async () => {
  //     await req.get(SETTINGS.PATHS.BLOGS + "/22" + "/posts").expect(404);
  //   });
  // });

  // describe("create post for a specific blog", () => {
  //   afterAll(async () => {
  //     await clearCollections();
  //   });

  //   let blogId = "";
  //   it("should create new post for a specific blog", async () => {
  //     const blogDb = await createNewBlogInDb();
  //     const newPostDto = createPostForBlogDto({});

  //     blogId = blogDb.id;

  //     const res = await req
  //       .post(SETTINGS.PATHS.BLOGS + `/${blogDb.id}` + "/posts")
  //       .set(basicAuth)
  //       .send(newPostDto)
  //       .expect(201);

  //     expect(res.body).toEqual({
  //       id: expect.any(String),
  //       title: newPostDto.title,
  //       shortDescription: newPostDto.shortDescription,
  //       content: newPostDto.content,
  //       blogId: blogDb.id,
  //       blogName: expect.any(String),
  //       createdAt: expect.any(String),
  //     });

  //     await req.get(SETTINGS.PATHS.POSTS + `/${res.body.id}`).expect(200);
  //   });

  //   it("should not create new post for a specific blog with incorrect blogId", async () => {
  //     const newPostDto = createPostForBlogDto({});

  //     await req
  //       .post(SETTINGS.PATHS.BLOGS + "/22/posts")
  //       .set(basicAuth)
  //       .send(newPostDto)
  //       .expect(404);
  //   });

  //   it("should not create new post for a specific blog with incorrect input values", async () => {
  //     const newPostDto = createPostForBlogDto({
  //       title: "",
  //     });

  //     await req
  //       .post(SETTINGS.PATHS.BLOGS + `/${blogId}` + "/posts")
  //       .set(basicAuth)
  //       .send(newPostDto)
  //       .expect(400);
  //   });

  //   it("should not create new post for a specific blog without authorization", async () => {
  //     const postDto = createPostForBlogDto({});

  //     await req
  //       .post(SETTINGS.PATHS.BLOGS + `/${blogId}` + "/posts")
  //       .send(postDto)
  //       .expect(401);
  //   });
  // });

  describe("delete post", () => {
    afterAll(async () => {
      await clearCollections();
    });

    let blogId = "";

    it("should not delete the blog by unauthorized user", async () => {
      const blogDb = await createNewBlogInDb();
      blogId = blogDb.id;

      await req.delete(SETTINGS.PATHS.BLOGS + `/${blogId}`).expect(401);
    });

    it("should not delete the blog with incorrect id", async () => {
      await req
        .delete(SETTINGS.PATHS.BLOGS + `/${blogId + 22}`)
        .set(basicAuth)
        .expect(404);
    });

    it("should delete the blog", async () => {
      await req
        .delete(SETTINGS.PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .expect(204);

      await req
        .delete(SETTINGS.PATHS.BLOGS + `/${blogId}`)
        .set(basicAuth)
        .expect(404);
    });
  });

  it("should return all posts", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS).expect(200);

    expect(res.body).toEqual(defaultPagination);
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

  it("should return a post by id", async () => {
    const postDb = await createPostInDbHelper();

    const res = await req
      .get(SETTINGS.PATHS.POSTS + `/${postDb.id}`)
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

  it("should update the post", async () => {
    const postDb = await createPostInDbHelper();
    const updatedPostDto = createPostDto({
      blogId: postDb.blogId,
      content: "new-content",
      title: "new-title",
    });

    await req
      .put(SETTINGS.PATHS.POSTS + `/${postDb.id}`)
      .set(basicAuth)
      .send(updatedPostDto)
      .expect(204);

    const updatedPostRes = await req
      .get(SETTINGS.PATHS.POSTS + `/${postDb.id}`)
      .expect(200);

    expect(updatedPostRes.body).toEqual({
      id: postDb.id,
      title: updatedPostDto.title,
      content: updatedPostDto.content,
      shortDescription: postDb.shortDescription,
      blogId: postDb.blogId,
      blogName: postDb.blogId,
      createdAt: expect.any(String),
    });
  });

  it("should not update the post with incorrect input values", async () => {
    const postDb = await createPostInDbHelper();
    const updatedPostDto = createPostDto({
      blogId: postDb.blogId,
      content: "",
      title: "",
    });

    await req
      .put(SETTINGS.PATHS.POSTS + `/${postDb.id}`)
      .set(basicAuth)
      .send(updatedPostDto)
      .expect(400);
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

  it("should not return a post by incorrect id", async () => {
    const postDb = await createPostInDbHelper();

    await req.get(SETTINGS.PATHS.POSTS + `/${postDb.id + 22}`).expect(404);
  });

  it("should not update the post by incorrect id", async () => {
    const postDb = await createPostInDbHelper();

    const updatedPostDto = createPostDto({
      blogId: postDb.blogId,
      content: "new",
      title: "new",
    });

    await req
      .put(SETTINGS.PATHS.POSTS + `/${postDb.id + 22}`)
      .set(basicAuth)
      .send(updatedPostDto)
      .expect(404);
  });

  it("should not update the post by unauthorized user", async () => {
    const postDb = await createPostInDbHelper();
    const updatedPostDto = createPostDto({
      blogId: postDb.blogId,
      content: "new",
      title: "new",
    });

    const res = await req
      .put(SETTINGS.PATHS.POSTS + `/${postDb.id}`)
      .send(updatedPostDto)
      .expect(401);

    expect(res.status).toBe(401);
  });

  it("should not create new post by unauthorized user", async () => {
    const newPostDto = createPostDtobHelper();

    await req.post(SETTINGS.PATHS.POSTS).send(newPostDto).expect(401);
  });

  it("should not delete the post by unauthorized user", async () => {
    const postDb = await createPostInDbHelper();

    await req.delete(SETTINGS.PATHS.POSTS + `/${postDb.id}`).expect(401);
  });

  it("should not delete the post by incorrect id", async () => {
    const postDb = await createPostInDbHelper();

    await req
      .delete(SETTINGS.PATHS.POSTS + `/${postDb.id + 22}`)
      .set(basicAuth)
      .expect(404);
  });

  it("should delete the post", async () => {
    const postDb = await createPostInDbHelper();

    await req
      .delete(SETTINGS.PATHS.POSTS + `/${postDb.id}`)
      .set(basicAuth)
      .expect(204);

    await req.get(SETTINGS.PATHS.POSTS + `/${postDb.id}`).expect(404);
  });
});
