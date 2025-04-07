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
    const blogDb = await createNewBlogInDb();
    const newPostDto = createPostDto({ blogId: blogDb.id });
    const updatedPostDto = createPostDto({
      blogId: blogDb.id,
      content: "new-content",
      title: "new-title",
    });
    const postDb = await createNewPostInDb(newPostDto);

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
      blogId: blogDb.id,
      blogName: blogDb.name,
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
