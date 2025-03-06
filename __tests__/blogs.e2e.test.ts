import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";

describe("/blogs", () => {
  it("should return all blogs", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
  let newBlogId = "";
  it("should create new blog", async () => {
    const res = await req.post(SETTINGS.PATHS.BLOGS).send({
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
    const res = await req.put(SETTINGS.PATHS.BLOGS + `/${newBlogId}`).send({
      name: "string",
      description: "string",
      websiteUrl:
        "https://CFmtGHgSrdK8RAi17yWDxkrSSDfIhNhEeoRyfrni-qLwAczJc1se-ZON5AHM9zbzrAwbn2gVR37SF2i8seXTNpsmD.9L",
    });

    expect(res.status).toBe(204);
  });

  it("should not get the blog by the incorrect id", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS + "/22");

    expect(res.status).toBe(404);
  });

  it("should not update the blog with incorrect id", async () => {
    const res = await req.put(SETTINGS.PATHS.BLOGS + "/22");

    expect(res.status).toBe(404);
  });

  it("should not delete the blog with incorrect id", async () => {
    const res = await req.delete(SETTINGS.PATHS.BLOGS + "/22");

    expect(res.status).toBe(404);
  });

  it("should delete the blog", async () => {
    const res = await req.delete(SETTINGS.PATHS.BLOGS + `/${newBlogId}`);

    expect(res.status).toBe(204);
  });
});
