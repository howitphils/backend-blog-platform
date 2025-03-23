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

  blogsCollection = db.collection<BlogDbType>(SETTINGS.BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<PostDbType>(SETTINGS.POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    console.log("Connected to db");
  } catch (error) {
    await client.close();
    console.log("Connection with db has been closed");
  }
  return client;
};

// // получение доступа к бд
// const client = new MongoClient(SETTINGS.MONGO_URL);
// const db = client.db(SETTINGS.DB_NAME);

// // получение доступа к коллекциям
// export const blogsCollection = db.collection<BlogViewModel>(
//   SETTINGS.BLOG_COLLECTION_NAME
// );
// export const postsCollection = db.collection<PostViewModel>(
//   SETTINGS.POST_COLLECTION_NAME
// );

export const clearCollections = async () => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
};

// export const closeConnection = async () => {
//   await client.close();
// };

// // проверка подключения к бд
// export const connectToDB = async () => {
//   try {
//     await client.connect();
//     console.log("connected to db");
//   } catch (e) {
//     console.log(e);
//     await client.close();
//   }
// };
