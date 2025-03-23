import { PostDbType } from "./../../types/posts-types";
import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../../settings";
import { BlogDbType } from "../../types/blogs-types";
import { UserDbType } from "../../types/users-types";

export let blogsCollection: Collection<BlogDbType>;
export let postsCollection: Collection<PostDbType>;
export let usersCollection: Collection<UserDbType>;

export const runDb = async (url: string, dbName: string | undefined) => {
  const client = new MongoClient(url);
  const db = client.db(dbName);

  blogsCollection = db.collection<BlogDbType>(
    SETTINGS.COLLECTIONS.BLOGS_COLLECTION_NAME
  );
  postsCollection = db.collection<PostDbType>(
    SETTINGS.COLLECTIONS.POSTS_COLLECTION_NAME
  );
  usersCollection = db.collection<UserDbType>(
    SETTINGS.COLLECTIONS.USERS_COLLECTION_NAME
  );

  try {
    await client.connect();
    console.log("Connected to db");
  } catch (error) {
    await client.close();
    console.log("Connection with db has been closed");
  }
  return client;
};

export const clearCollections = async () => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  await usersCollection.deleteMany({});
};
