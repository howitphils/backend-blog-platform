// import { closeConnection, clearCollections } from "../src/db/mongodb/mongodb";
import { MongoClient } from "mongodb";
import { encodedCredentials } from "../src/middlewares/auth-validator";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";
import { clearCollections, runDb } from "../src/db/mongodb/mongodb";

describe("/blogs", () => {
  let client: MongoClient;
  beforeAll(async () => {
    // Создаем новое тестовое соединение
    client = await runDb(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    // Очищаем коллекции
    await clearCollections();
  });

  afterAll(async () => {
    // Закрываем коннект с дб
    await client.close();
    console.log("Connection closed");
  });

  it("should return all blogs", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body.items.length).toBe(0);
  });

  let newBlogId = "";
  it("should create new blog", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        name: "string",
        description: "string",
        websiteUrl:
          "https://prCzBUZX3K470uTKkNarDsYVFRAuTgO69cNATgDtBoH69Z3H.X93fa_hi1VVPvCJLchzT29V245-7s3ET5UsFtWYTT.c",
      });
    newBlogId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("websiteUrl");
  });

  it("should return a blog by id", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS + `/${newBlogId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("websiteUrl");
    expect(res.body).toHaveProperty("name");
  });

  it("should update the blog", async () => {
    const res = await req
      .put(SETTINGS.PATHS.BLOGS + `/${newBlogId}`)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        name: "string",
        description: "string",
        websiteUrl:
          "https://CFmtGHgSrdK8RAi17yWDxkrSSDfIhNhEeoRyfrni-qLwAczJc1se-ZON5AHM9zbzrAwbn2gVR37SF2i8seXTNpsmD.9L",
      });

    expect(res.status).toBe(204);
  });

  it("should return all posts for a specific blog", async () => {
    const res = await req.get(
      SETTINGS.PATHS.BLOGS + `/${newBlogId}` + "/posts"
    );

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(0);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalCount");
  });

  it("should create new post for a specific blog", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS + `/${newBlogId}` + "/posts")
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        title: "new post",
        shortDescription: "description of new post",
        content: "hi",
        blogId: newBlogId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("shortDescription");
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("content");
  });

  it("should not create new post for a specific blog with incorrect blogId", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS + `/22` + "/posts")
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        title: "new post",
        shortDescription: "description of new post",
        content: "hi",
        blogId: "22",
      });

    expect(res.status).toBe(404);
  });

  it("should not create new post for a specific blog with incorrect input values", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS + `/${newBlogId}` + "/posts")
      .set("Authorization", `Basic ${encodedCredentials}`)
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
      .send({
        title: "asd",
        shortDescription: "dasd",
        content: "hi",
        blogId: newBlogId,
      });

    expect(res.status).toBe(401);
  });

  it("should not return all posts for a specific blog with incorrect blogId", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS + "/22" + "/posts");

    expect(res.status).toBe(404);
  });

  it("should not update the blog with incorrect input values", async () => {
    const res = await req
      .put(SETTINGS.PATHS.BLOGS + `/${newBlogId}`)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        name: "",
        description: 22,
        websiteUrl:
          "https://7yBv92fgGo0t8xC3fw0diQSX_pM5.1JBYMWGV_S16tDf.bRumPCkBd3AU9593hmWkAtecZy9O1gU4wAbmwbzGkSOHlL4",
      });

    expect(res.status).toBe(400);
  });

  it("should not create new blog with incorrect input values", async () => {
    const res = await req
      .post(SETTINGS.PATHS.BLOGS)
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        name: 22,
        description: 10,
        websiteUrl:
          "https://7yBv92fgGo0t8xC3fw0diQSX_pM5.1JBYMWGV_S16tDf.bRumPCkBd3AU9593hmWkAtecZy9O1gU4wAbmwbzGkSOHlL4",
      });
    expect(res.status).toBe(400);
  });

  it("should not update the blog by unauthorized user", async () => {
    const res = await req.put(SETTINGS.PATHS.BLOGS + `/${newBlogId}`).send({
      name: "string",
      description: "string",
      websiteUrl:
        "https://7yBv92fgGo0t8xC3fw0diQSX_pM5.1JBYMWGV_S16tDf.bRumPCkBd3AU9593hmWkAtecZy9O1gU4wAbmwbzGkSOHlL4",
    });

    expect(res.status).toBe(401);
  });

  it("should not create new blog by unauthorized user", async () => {
    const res = await req.post(SETTINGS.PATHS.BLOGS).send({
      name: "string",
      description: "string",
      websiteUrl:
        "https://7yBv92fgGo0t8xC3fw0diQSX_pM5.1JBYMWGV_S16tDf.bRumPCkBd3AU9593hmWkAtecZy9O1gU4wAbmwbzGkSOHlL4",
    });

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
      .set("Authorization", `Basic ${encodedCredentials}`)
      .send({
        name: "string",
        description: "string",
        websiteUrl:
          "https://CFmtGHgSrdK8RAi17yWDxkrSSDfIhNhEeoRyfrni-qLwAczJc1se-ZON5AHM9zbzrAwbn2gVR37SF2i8seXTNpsmD.9L",
      });

    expect(res.status).toBe(404);
  });

  it("should not delete the blog with incorrect id", async () => {
    const res = await req
      .delete(SETTINGS.PATHS.BLOGS + "/22")
      .set("Authorization", `Basic ${encodedCredentials}`);

    expect(res.status).toBe(404);
  });

  it("should delete the blog", async () => {
    const res = await req
      .delete(SETTINGS.PATHS.BLOGS + `/${newBlogId}`)
      .set("Authorization", `Basic ${encodedCredentials}`);

    expect(res.status).toBe(204);
  });
});
