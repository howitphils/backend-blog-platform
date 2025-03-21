import { MongoClient } from "mongodb";
import { clearCollections, runDb } from "../src/db/mongodb/mongodb";
import { encodedCredentials } from "../src/middlewares/auth-validator";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";

describe("/posts", () => {
  let client: MongoClient;
  let blogId = "";

  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);

    // Очищаем коллекции
    await clearCollections();

    // Создаем тестовый блог
    const res = await req
      .post(SETTINGS.PATHS.BLOGS)
      .send({
        name: "for tests",
        description: "testing blog",
        websiteUrl:
          "https://4fd52Gm05tw-H.IvRO784KcLEXZfMiGH2HCCBknni9Lb3fslAoStogClBLYb2oLnvcbatCNWUIdxhxr_j.PNjEnWql3u",
      })
      .set("Authorization", `Basic ${encodedCredentials}`);

    blogId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name");
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("should return all posts", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body.items.length).toBe(0);
  });

  let newPostId = "";
  it("should create new post", async () => {
    const res = await req
      .post(SETTINGS.PATHS.POSTS)
      .set("authorization", `Basic ${encodedCredentials}`)
      .send({
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId,
      });
    newPostId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("shortDescription");
    expect(res.body).toHaveProperty("blogId");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("content");
  });

  it("should return a post by id", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS + `/${newPostId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("shortDescription");
    expect(res.body).toHaveProperty("blogId");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("content");
  });

  it("should update the post", async () => {
    const res = await req
      .put(SETTINGS.PATHS.POSTS + `/${newPostId}`)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId,
      });

    expect(res.status).toBe(204);
  });

  it("should not update the post with incorrect input values", async () => {
    const res = await req
      .put(SETTINGS.PATHS.POSTS + `/${newPostId}`)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        title: "",
        shortDescription: "string",
        content: "string",
        blogId: "12",
      });

    expect(res.status).toBe(400);
  });

  it("should not create new post with incorrect input values", async () => {
    const res = await req
      .post(SETTINGS.PATHS.POSTS)
      .set("authorization", `Basic ${encodedCredentials}`)
      .send({
        title: "",
        shortDescription: 10,
        content: "string",
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
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId,
      });

    expect(res.status).toBe(404);
  });

  it("should not update the post by unauthorized user", async () => {
    const res = await req.put(SETTINGS.PATHS.POSTS + `/${newPostId}`).send({
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId,
    });

    expect(res.status).toBe(401);
  });

  it("should not create new post by unauthorized user", async () => {
    const res = await req.post(SETTINGS.PATHS.POSTS).send({
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId,
    });

    expect(res.status).toBe(401);
  });

  it("should not delete the post by unauthorized user", async () => {
    const res = await req.delete(SETTINGS.PATHS.POSTS + `/${newPostId}`);

    expect(res.status).toBe(401);
  });

  it("should not delete the post by incorrect id", async () => {
    const res = await req
      .delete(SETTINGS.PATHS.POSTS + "/22")
      .set("Authorization", `Basic ${encodedCredentials}`);

    expect(res.status).toBe(404);
  });

  it("should delete the post", async () => {
    const res = await req
      .delete(SETTINGS.PATHS.POSTS + `/${newPostId}`)
      .set("Authorization", `Basic ${encodedCredentials}`);

    expect(res.status).toBe(204);
  });
});
