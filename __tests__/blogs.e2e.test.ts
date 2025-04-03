import { MongoClient } from "mongodb";
import { SETTINGS } from "../src/settings";
import { basicAuth, defaultPagination, req } from "./test-helpers";
import { runDb } from "../src/db/mongodb/mongodb";

describe("/blogs", () => {
  let client: MongoClient;

  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    // Очищаем коллекции
    await req.delete(SETTINGS.PATHS.TESTS + "/all-data").expect(204);
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("should return all blogs", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(defaultPagination);
  });

  let newBlogId = "";
  it("should create new blog", async () => {
    const res = await req.post(SETTINGS.PATHS.BLOGS).set(basicAuth).send({
      name: "test-blog",
      description: "for tests",
      websiteUrl: "https://prCzB",
    });
    newBlogId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      name: "test-blog",
      description: "for tests",
      websiteUrl: "https://prCzB",
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it("should return a blog by id", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS + `/${newBlogId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: newBlogId,
      name: "test-blog",
      description: "for tests",
      websiteUrl: "https://prCzB",
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it("should update the blog", async () => {
    const res = await req
      .put(SETTINGS.PATHS.BLOGS + `/${newBlogId}`)
      .set(basicAuth)
      .send({
        name: "string",
        description: "string",
        websiteUrl: "https://CFhjd",
      });

    expect(res.status).toBe(204);
  });

  it("should return all posts for a specific blog", async () => {
    const res = await req.get(
      SETTINGS.PATHS.BLOGS + `/${newBlogId}` + "/posts"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual(defaultPagination);
  });

  it("should create new post for a specific blog", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS + `/${newBlogId}` + "/posts")
      .set(basicAuth)
      .send({
        title: "new post",
        shortDescription: "description of new post",
        content: "hi",
        blogId: newBlogId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      title: "new post",
      shortDescription: "description of new post",
      content: "hi",
      blogId: newBlogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should not create new post for a specific blog with incorrect blogId", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS + "/22/posts")
      .set(basicAuth)
      .send({});

    expect(res.status).toBe(404);
  });

  it("should not create new post for a specific blog with incorrect input values", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS + `/${newBlogId}` + "/posts")
      .set(basicAuth)
      .send({
        title: "",
        shortDescription: 29,
        content: "hi",
        blogId: "22",
      });

    expect(res.status).toBe(400);
  });

  it("should not create new post for a specific blog without authorization", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS + `/${newBlogId}` + "/posts")
      .send({});

    expect(res.status).toBe(401);
  });

  it("should not return all posts for a specific blog with incorrect blogId", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS + "/22" + "/posts");

    expect(res.status).toBe(404);
  });

  it("should not update the blog with incorrect input values", async () => {
    const res = await req
      .put(SETTINGS.PATHS.BLOGS + `/${newBlogId}`)
      .set(basicAuth)
      .send({
        name: "",
        description: 22,
        websiteUrl: "not_an_url",
      });

    expect(res.status).toBe(400);
  });

  it("should not create new blog with incorrect input values", async () => {
    const res = await req.post(SETTINGS.PATHS.BLOGS).set(basicAuth).send({
      name: 22,
      description: 10,
      websiteUrl: "not_an_url",
    });
    expect(res.status).toBe(400);
  });

  it("should not update the blog by unauthorized user", async () => {
    const res = await req.put(SETTINGS.PATHS.BLOGS + `/${newBlogId}`).send({});

    expect(res.status).toBe(401);
  });

  it("should not create new blog by unauthorized user", async () => {
    const res = await req.post(SETTINGS.PATHS.BLOGS).send({});

    expect(res.status).toBe(401);
  });

  it("should not delete the blog by unauthorized user", async () => {
    const res = await req.delete(SETTINGS.PATHS.BLOGS + `/${newBlogId}`);

    expect(res.status).toBe(401);
  });

  it("should not get the blog by the incorrect id", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS + "/22");

    expect(res.status).toBe(404);
  });

  it("should not update the blog with incorrect id", async () => {
    const res = await req
      .put(SETTINGS.PATHS.BLOGS + "/22")
      .set(basicAuth)
      .send({});

    expect(res.status).toBe(404);
  });

  it("should not delete the blog with incorrect id", async () => {
    const res = await req.delete(SETTINGS.PATHS.BLOGS + "/22").set(basicAuth);

    expect(res.status).toBe(404);
  });

  it("should delete the blog", async () => {
    const res = await req
      .delete(SETTINGS.PATHS.BLOGS + `/${newBlogId}`)
      .set(basicAuth);

    expect(res.status).toBe(204);
  });
});
