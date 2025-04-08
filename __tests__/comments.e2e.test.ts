import { SETTINGS } from "../src/settings";
import {
  createNewUserInDb,
  createPostInDbHelper,
  createUserDto,
  defaultPagination,
  getAccessToken,
  jwtAuth,
  req,
} from "./test-helpers";
import { MongoClient } from "mongodb";
import { clearCollections, runDb } from "../src/db/mongodb/mongodb";

describe("/comments", () => {
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

  it("should return all comments for specific post", async () => {
    const token = await getAccessToken();
    const dbPost = await createPostInDbHelper();

    const res = await req
      .get(`${SETTINGS.PATHS.POSTS}/${dbPost.id}/comments`)
      .set(jwtAuth(token))
      .expect(200);

    expect(res.body).toEqual(defaultPagination);
  });

  it("should create a comment", async () => {
    const newUserDto = createUserDto({});
    const dbUser = await createNewUserInDb(newUserDto);
    const token = await getAccessToken(newUserDto);
    const dbPost = await createPostInDbHelper();

    const res = await req
      .post(`${SETTINGS.PATHS.POSTS}/${dbPost.id}/comments`)
      .set(jwtAuth(token))
      .send({ content: "hello, world!" })
      .expect(201);

    console.log(res.body);

    expect(res.body).toEqual({
      id: expect.any(String),
      content: "hello, world!",
      commentatorInfo: {
        userId: dbUser.id,
        userLogin: dbUser.login,
      },
      createdAt: expect.any(String),
    });
  });
});
