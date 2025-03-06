import { SETTINGS } from "../src/settings";
import { req } from "./test-helpers";

describe("/posts", () => {
  it("should return all posts", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
  let newPostId = "";
  it("should create new post", async () => {
    const res = await req.post(SETTINGS.PATHS.POSTS).send({
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: "string",
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
    const res = await req.put(SETTINGS.PATHS.POSTS + `/${newPostId}`).send({
      title: "string",
      shortDescription: "string",
      content: "string",
      blogId: "string",
    });

    expect(res.status).toBe(204);
  });

  it("should not return the blog by the incorrect id", async () => {
    const res = await req.get(SETTINGS.PATHS.POSTS + "/22");

    expect(res.status).toBe(404);
  });

  it("should not update the blog with incorrect id", async () => {
    const res = await req.put(SETTINGS.PATHS.POSTS + "/22");

    expect(res.status).toBe(404);
  });

  it("should not delete the blog with incorrect id", async () => {
    const res = await req.delete(SETTINGS.PATHS.POSTS + "/22");

    expect(res.status).toBe(404);
  });

  it("should delete the blog", async () => {
    const res = await req.delete(SETTINGS.PATHS.POSTS + `/${newPostId}`);

    expect(res.status).toBe(204);
  });
});
