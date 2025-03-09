import { MongoClient } from "mongodb";
import { SETTINGS } from "../../settings";
import { BlogViewModel } from "../../types/blogs-types";
import { PostViewModel } from "../../types/posts-types";

// получение доступа к бд
const client = new MongoClient(SETTINGS.MONGO_URL);
const db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export const blogCollection = db.collection<BlogViewModel>(
  SETTINGS.BLOG_COLLECTION_NAME
);
export const postCollection = db.collection<PostViewModel>(
  SETTINGS.POST_COLLECTION_NAME
);

// проверка подключения к бд
export const connectToDB = async () => {
  try {
    await client.connect();
    console.log("connected to db");
  } catch (e) {
    console.log(e);
    await client.close();
  }
};
