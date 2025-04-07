import { Db, MongoClient } from "mongodb";
import { UserDbType } from "../../types/users-types";
import { PostDbType } from "../../types/posts-types";
import { BlogDbType } from "../../types/blogs-types";

export const db = {
  client: {} as MongoClient,

  getDb(dbName: string): Db {
    return this.client.db(dbName);
  },

  async run(url: string) {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      console.log("Connected successfully to mongo server");
    } catch (e: unknown) {
      console.error("Can't connect to mongo server", e);
      await this.client.close();
    }
  },

  async close() {
    await this.client.close();
    console.log("Connection successful closed");
  },

  async clear(dbName: string) {
    try {
      const collections = await this.getDb(dbName).listCollections().toArray();

      for (const collection of collections) {
        const collectionName = collection.name;
        await this.getDb(dbName).collection(collectionName).deleteMany({});
      }
    } catch (e: unknown) {
      console.error("Error in drop db:", e);
      await this.close();
    }
  },

  getCollections(dbName: string) {
    return {
      usersCollection: this.getDb(dbName).collection<UserDbType>("users"),
      postsCollection: this.getDb(dbName).collection<PostDbType>("posts"),
      blogsCollection: this.getDb(dbName).collection<BlogDbType>("blogs"),
    };
  },
};
