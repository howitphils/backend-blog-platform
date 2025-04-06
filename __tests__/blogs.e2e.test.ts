import { MongoClient } from "mongodb";
import { SETTINGS } from "../src/settings";
import {
  basicAuth,
  createBlogDto,
  createNewBlogInDb,
  createPostDto,
  defaultPagination,
  req,
} from "./test-helpers";
import { runDb } from "../src/db/mongodb/mongodb";

describe("/blogs", () => {
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

  it(" + should return all blogs", async () => {
    const res = await req.get(SETTINGS.PATHS.BLOGS).expect(200);

    expect(res.body).toEqual(defaultPagination);
  });

  it(" + should create new blog", async () => {
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

  it(" + should return a blog by id", async () => {
    const blogDb = await createNewBlogInDb();

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

  it(" + should update the blog", async () => {
    const updatedBlogDto = createBlogDto({
      name: "new-name",
      description: "new-description",
      websiteUrl: "https://new_url",
    });

    const blogDb = await createNewBlogInDb();

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

  it(" + should return all posts for a specific blog", async () => {
    const blogDb = await createNewBlogInDb();

    const res = await req
      .get(SETTINGS.PATHS.BLOGS + `/${blogDb.id}` + "/posts")
      .expect(200);

    expect(res.body).toEqual(defaultPagination);
  });

  it(" + should create new post for a specific blog", async () => {
    const blogDb = await createNewBlogInDb();
    const newPostDto = createPostDto({});

    const res = await req
      .post(SETTINGS.PATHS.BLOGS + `/${blogDb.id}` + "/posts")
      .set(basicAuth)
      .send(newPostDto)
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

    await req.get(SETTINGS.PATHS.POSTS + `/${res.body.id}`).expect(200);
  });

  it(" - should not create new post for a specific blog with incorrect blogId", async () => {
    const newPostDto = createPostDto({});

    await req
      .post(SETTINGS.PATHS.BLOGS + "/22/posts")
      .set(basicAuth)
      .send(newPostDto)
      .expect(404);
  });

  it(" - should not create new post for a specific blog with incorrect input values", async () => {
    const blogDb = await createNewBlogInDb();

    const newPostDto = createPostDto({
      title: "",
    });

    await req
      .post(SETTINGS.PATHS.BLOGS + `/${blogDb.id}` + "/posts")
      .set(basicAuth)
      .send(newPostDto)
      .expect(400);
  });

  it(" - should not create new post for a specific blog without authorization", async () => {
    const blogDb = await createNewBlogInDb();
    const postDto = createPostDto({});

    await req
      .post(SETTINGS.PATHS.BLOGS + `/${blogDb.id}` + "/posts")
      .send(postDto)
      .expect(401);
  });

  it(" - should not return all posts for a specific blog with incorrect blogId", async () => {
    await req.get(SETTINGS.PATHS.BLOGS + "/22" + "/posts").expect(404);
  });

  it(" - should not update the blog with incorrect input values", async () => {
    const newBlogDto = createBlogDto({
      name: "",
    });

    const blogDb = await createNewBlogInDb();

    await req
      .put(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`)
      .set(basicAuth)
      .send(newBlogDto)
      .expect(400);
  });

  it(" - should not create new blog with incorrect input values", async () => {
    const newBlogDto = createBlogDto({
      name: "",
    });

    await req
      .post(SETTINGS.PATHS.BLOGS)
      .set(basicAuth)
      .send(newBlogDto)
      .expect(400);
  });

  it(" - should not update the blog by unauthorized user", async () => {
    const blogDb = await createNewBlogInDb();
    const newBlogDto = createBlogDto({
      name: "new_name",
    });

    await req
      .put(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`)
      .send(newBlogDto)
      .expect(401);
  });

  it(" - should not create new blog by unauthorized user", async () => {
    const newBlogDto = createBlogDto({});

    await req.post(SETTINGS.PATHS.BLOGS).send(newBlogDto).expect(401);
  });

  it(" - should not delete the blog by unauthorized user", async () => {
    const blogDb = await createNewBlogInDb();

    await req.delete(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`).expect(401);
  });

  it(" - should not get the blog by the incorrect id", async () => {
    const blogDb = await createNewBlogInDb();

    await req.get(SETTINGS.PATHS.BLOGS + `/${blogDb.id + 22}`).expect(404);
  });

  it(" - should not update the blog with incorrect id", async () => {
    const newBlogDto = createBlogDto({
      name: "new_blog_name",
    });

    const blogDb = await createNewBlogInDb();

    await req
      .put(SETTINGS.PATHS.BLOGS + `/${blogDb.id + 22}`)
      .set(basicAuth)
      .send(newBlogDto)
      .expect(404);
  });

  it(" - should not delete the blog with incorrect id", async () => {
    const blogDb = await createNewBlogInDb();

    await req
      .delete(SETTINGS.PATHS.BLOGS + `/${blogDb.id + 22}`)
      .set(basicAuth)
      .expect(404);
  });

  it(" + should delete the blog", async () => {
    const blogDb = await createNewBlogInDb();

    await req
      .delete(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`)
      .set(basicAuth)
      .expect(204);

    await req
      .delete(SETTINGS.PATHS.BLOGS + `/${blogDb.id}`)
      .set(basicAuth)
      .expect(404);
  });
});
