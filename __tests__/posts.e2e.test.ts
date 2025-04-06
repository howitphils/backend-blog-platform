import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import {
  basicAuth,
  createNewBlogInDb,
  createNewPostInDb,
  createPostDto,
  defaultPagination,
  req,
} from "./test-helpers";

describe("/posts", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
  });

  beforeEach(async () => {
    await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);
  });

  afterAll(async () => {
    await client.close();
    console.log("Connection closed");
  });

  it("should return all posts", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS).expect(200);

    expect(res.body).toEqual(defaultPagination);
  });

  it("should create new post", async () => {
    const blogDb = await createNewBlogInDb();
    const newPostDto = createPostDto({});

    const res = await req
      .post(SETTINGS.PATHS.POSTS)
      .set(basicAuth)
      .send({
        ...newPostDto,
        blogId: blogDb.id,
      })
      .expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      title: newPostDto.title,
      shortDescription: newPostDto.shortDescription,
      content: newPostDto.content,
      blogId: blogDb.id,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });

    const postsRes = await req.get(SETTINGS.PATHS.POSTS).expect(200);

    expect(postsRes.body.items.length).toBe(1);
  });

  it("should return a post by id", async () => {
    const blogDb = await createNewBlogInDb();
    const postDb = await createNewPostInDb();

    const res = await req
      .get(SETTINGS.PATHS.POSTS + `/${postDb.id}`)
      .expect(200);

    expect(res.body).toEqual({
      id: postDb.id,
      title: postDb.title,
      shortDescription: postDb.shortDescription,
      content: postDb.content,
      blogId: postDb.blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should update the post", async () => {
    const res = await req
      .put(SETTINGS.PATHS.POSTS + `/${newPostId}`)
      .set(basicAuth)
      .send({
        title: "new-title",
        shortDescription: "new-description",
        content: "new-content",
        blogId,
      });

    expect(res.status).toBe(204);
  });

  it("should return updated post", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS + `/${newPostId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: newPostId,
      title: "new-title",
      shortDescription: "new-description",
      content: "new-content",
      blogId: blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should not update the post with incorrect input values", async () => {
    const res = await req
      .put(SETTINGS.PATHS.POSTS + `/${newPostId}`)
      .set(basicAuth)
      .send({
        title: "",
        shortDescription: 22,
        content: false,
        blogId: "12",
      });

    expect(res.status).toBe(400);
  });

  it("should not create new post with incorrect input values", async () => {
    const res = await req.post(SETTINGS.PATHS.POSTS).set(basicAuth).send({
      title: "",
      shortDescription: 10,
      content: false,
      blogId,
    });
    expect(res.status).toBe(400);
  });

  it("should not return a post by incorrect id", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS + "/22");

    expect(res.status).toBe(404);
  });

  it("should not update the post by incorrect id", async () => {
    const res = await req
      .put(SETTINGS.PATHS.POSTS + "/22")
      .set(basicAuth)
      .send({});

    expect(res.status).toBe(404);
  });

  it("should not update the post by unauthorized user", async () => {
    const res = await req.put(SETTINGS.PATHS.POSTS + `/${newPostId}`).send({});

    expect(res.status).toBe(401);
  });

  it("should not create new post by unauthorized user", async () => {
    const res = await req.post(SETTINGS.PATHS.POSTS).send({});

    expect(res.status).toBe(401);
  });

  it("should not delete the post by unauthorized user", async () => {
    const res = await req.delete(SETTINGS.PATHS.POSTS + `/${newPostId}`);

    expect(res.status).toBe(401);
  });

  it("should not delete the post by incorrect id", async () => {
    const res = await req.delete(SETTINGS.PATHS.POSTS + "/22").set(basicAuth);

    expect(res.status).toBe(404);
  });

  it("should delete the post", async () => {
    const res = await req
      .delete(SETTINGS.PATHS.POSTS + `/${newPostId}`)
      .set(basicAuth);

    expect(res.status).toBe(204);
  });
});
