import { MongoClient } from "mongodb";
import { SETTINGS } from "../../settings";
import { BlogViewModel } from "../../types/blogs-types";
import { PostViewModel } from "../../types/posts-types";

// получение доступа к бд
const client = new MongoClient(SETTINGS.MONGO_URL);
const db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export const blogsCollection = db.collection<BlogViewModel>(
  SETTINGS.BLOG_COLLECTION_NAME
);
export const postsCollection = db.collection<PostViewModel>(
  SETTINGS.POST_COLLECTION_NAME
);

export const clearCollections = async () => {
  const collections = await db.listCollections().toArray();

  for (const collection of collections) {
    await db.collection(collection.name).deleteMany({});
    console.log(`Dropped collection: ${collection.name}`);
  }
  console.log("all collections dropped");
};

export const closeConnection = async () => {
  await client.close();
};

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
