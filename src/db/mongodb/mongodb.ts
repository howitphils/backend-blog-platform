import { PostDbType } from "./../../types/posts-types";
import { Collection, MongoClient } from "mongodb";
import { APP_CONFIG } from "../../settings";
import { BlogDbType } from "../../types/blogs-types";
import { UserDbType } from "../../types/users-types";
import { CommentDbType } from "../../types/comments-types";
import { SessionDbType } from "../../types/sessions-types";
import { ApiCallType } from "../../types/apiCalls";
import mongoose from "mongoose";

export let blogsCollection: Collection<BlogDbType>;
export let postsCollection: Collection<PostDbType>;
export let usersCollection: Collection<UserDbType>;
export let commentsCollection: Collection<CommentDbType>;
export let sessionsCollection: Collection<SessionDbType>;
export let apiCallsCollection: Collection<ApiCallType>;

const blogsSchema = new mongoose.Schema<BlogDbType>({
  name: { type: String, required: true },
  description: { type: String },
  websiteUrl: { type: String },
  createdAt: { type: String },
  isMembership: { type: Boolean },
});

const postsSchema = new mongoose.Schema<PostDbType>({
  title: { type: String },
  blogId: { type: String },
  blogName: { type: String },
  content: { type: String },
  createdAt: { type: String },
  shortDescription: { type: String },
});

export const runDb = async (url: string, dbName: string | undefined) => {
  const client = new MongoClient(url);
  const db = client.db(dbName);

  blogsCollection = db.collection<BlogDbType>(
    APP_CONFIG.COLLECTIONS.BLOGS_COLLECTION_NAME
  );
  postsCollection = db.collection<PostDbType>(
    APP_CONFIG.COLLECTIONS.POSTS_COLLECTION_NAME
  );
  usersCollection = db.collection<UserDbType>(
    APP_CONFIG.COLLECTIONS.USERS_COLLECTION_NAME
  );

  commentsCollection = db.collection<CommentDbType>(
    APP_CONFIG.COLLECTIONS.COMMENTS_COLLECTION_NAME
  );
  sessionsCollection = db.collection<SessionDbType>(
    APP_CONFIG.COLLECTIONS.SESSIONS_COLLECTION_NAME
  );
  apiCallsCollection = db.collection<ApiCallType>(
    APP_CONFIG.COLLECTIONS.APICALLS_COLLECTION_NAME
  );

  try {
    await mongoose.connect(url + "/" + dbName);
    // await client.connect();
    console.log("connected to db");
  } catch (error) {
    // await client.close();
    await mongoose.disconnect();
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
