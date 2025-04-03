import { MongoClient } from "mongodb";
import { runDb } from "../src/db/mongodb/mongodb";
import { SETTINGS } from "../src/settings";
import { basicAuth, defaultPagination, req } from "./test-helpers";

describe("/posts", () => {
  let client: MongoClient;
  let blogId = "";

  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);

    // Очищаем коллекции
    await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);

    // Создаем тестовый блог
    const res = await req.post(SETTINGS.PATHS.BLOGS).set(basicAuth).send({
      name: "for tests",
      description: "testing blog",
      websiteUrl: "https://4fd52G",
    });

    blogId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("id");
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("should return all posts", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(defaultPagination);
  });

  let newPostId = "";
  it("should create new post", async () => {
    const res = await req.post(SETTINGS.PATHS.POSTS).set(basicAuth).send({
      title: "new post",
      shortDescription: "description of new post",
      content: "hi",
      blogId,
    });

    newPostId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      title: "new post",
      shortDescription: "description of new post",
      content: "hi",
      blogId: blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should return a post by id", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS + `/${newPostId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: newPostId,
      title: "new post",
      shortDescription: "description of new post",
      content: "hi",
      blogId: blogId,
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
