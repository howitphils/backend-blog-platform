import { setDb } from "../src/db/memory/db";
import { encodedCredentials } from "../src/middlewares/auth-validator";
import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";

describe("/blogs", () => {
  beforeAll(async () => {
    setDb();
  });

  it("should return all blogs", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
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
