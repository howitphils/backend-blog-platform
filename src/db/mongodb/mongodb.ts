import { PostDbType } from "./../../types/posts-types";
import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../../settings";
import { BlogDbType } from "../../types/blogs-types";
import { UserDbType } from "../../types/users-types";
import { CommentDbType } from "../../types/comments-types";
import { SessionDbType } from "../../types/sessions-types";
import { ApiCallType } from "../../types/apiCalls";

export let blogsCollection: Collection<BlogDbType>;
export let postsCollection: Collection<PostDbType>;
export let usersCollection: Collection<UserDbType>;
export let commentsCollection: Collection<CommentDbType>;
export let sessionsCollection: Collection<SessionDbType>;
export let apiCallsCollection: Collection<ApiCallType>;

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

  commentsCollection = db.collection<CommentDbType>(
    SETTINGS.COLLECTIONS.COMMENTS_COLLECTION_NAME
  );
  sessionsCollection = db.collection<SessionDbType>(
    SETTINGS.COLLECTIONS.SESSIONS_COLLECTION_NAME
  );
  apiCallsCollection = db.collection<ApiCallType>(
    SETTINGS.COLLECTIONS.APICALLS_COLLECTION_NAME
  );

  try {
    await client.connect();
    console.log("connected to db");
  } catch (error) {
    await client.close();
  }
  return client;
};

export const clearCollections = async () => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  await usersCollection.deleteMany({});
  await commentsCollection.deleteMany({});
  await sessionsCollection.deleteMany({});
  await apiCallsCollection.deleteMany({});
};
