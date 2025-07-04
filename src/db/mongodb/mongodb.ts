import { PostDbType } from "./../../types/posts-types";
import { Collection } from "mongodb";
// import { APP_CONFIG } from "../../settings";
import { BlogDbType } from "../../types/blogs-types";
import { UserDbType } from "../../types/users-types";
import { CommentDbType } from "../../types/comments-types";
import { SessionDbType } from "../../types/sessions-types";
import { ApiCallType } from "../../types/apiCalls";
import mongoose from "mongoose";
import { BlogsModel } from "./repositories/blogs-repository/blogs-db-repository";

export let blogsCollection: Collection<BlogDbType>;
export let postsCollection: Collection<PostDbType>;
export let usersCollection: Collection<UserDbType>;
export let commentsCollection: Collection<CommentDbType>;
export let sessionsCollection: Collection<SessionDbType>;
export let apiCallsCollection: Collection<ApiCallType>;

const postsSchema = new mongoose.Schema<PostDbType>({
  title: { type: String },
  blogId: { type: String },
  blogName: { type: String },
  content: { type: String },
  createdAt: { type: String },
  shortDescription: { type: String },
});

export const PostsModel = mongoose.model("Post", postsSchema);

export const runDb = async (url: string, dbName: string | undefined) => {
  // const client = new MongoClient(url);
  // const db = client.db(dbName);

  // blogsCollection = db.collection<BlogDbType>(
  //   APP_CONFIG.COLLECTIONS.BLOGS_COLLECTION_NAME
  // );
  // postsCollection = db.collection<PostDbType>(
  //   APP_CONFIG.COLLECTIONS.POSTS_COLLECTION_NAME
  // );
  // usersCollection = db.collection<UserDbType>(
  //   APP_CONFIG.COLLECTIONS.USERS_COLLECTION_NAME
  // );
  // commentsCollection = db.collection<CommentDbType>(
  //   APP_CONFIG.COLLECTIONS.COMMENTS_COLLECTION_NAME
  // );
  // sessionsCollection = db.collection<SessionDbType>(
  //   APP_CONFIG.COLLECTIONS.SESSIONS_COLLECTION_NAME
  // );
  // apiCallsCollection = db.collection<ApiCallType>(
  //   APP_CONFIG.COLLECTIONS.APICALLS_COLLECTION_NAME
  // );

  try {
    await mongoose.connect(`${url}/${dbName}`);
    // await client.connect();
    console.log("connected to db");
  } catch (error) {
    await mongoose.disconnect();
    // await client.close();
  }
  // return client;
};

export const clearCollections = async () => {
  await BlogsModel.deleteMany({});
  // await postsCollection.deleteMany({});
  // await usersCollection.deleteMany({});
  // await commentsCollection.deleteMany({});
  // await sessionsCollection.deleteMany({});
  // await apiCallsCollection.deleteMany({});
};

// export const clearCollections = async () => {
//   await BlogsModel.deleteMany({});
//   await postsCollection.deleteMany({});
//   await usersCollection.deleteMany({});
//   await commentsCollection.deleteMany({});
//   await sessionsCollection.deleteMany({});
//   await apiCallsCollection.deleteMany({});
// };
