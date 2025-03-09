import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../../../types/posts-types";
import { postCollection } from "../mongodb";

// const findIndexByIdHelper = (id: string) => {
//   return db.posts.findIndex((post) => post.id === id);
// };

export const postsRepository = {
  getAllPosts: async () => {
    const posts = await postCollection.find({}).toArray();
    return posts;
  },
  // createNewPost: (post: PostInputModel): PostViewModel => {
  //   const newPost: PostViewModel = {
  //     ...post,
  //     id: String(Math.random() * 1000),
  //     blogName: "Blog" + Math.random() * 1000,
  //     createdAt: new Date().toISOString(),
  //   };
  //   db.posts.unshift(newPost);
  //   return newPost;
  // },
  // getPostById: (id: string) => {
  //   const targetPostIndex = findIndexByIdHelper(id);
  //   if (targetPostIndex === -1) return null;
  //   return db.posts[targetPostIndex];
  // },
  // updatePost: (id: string, post: PostInputModel) => {
  //   const targetPostIndex = findIndexByIdHelper(id);
  //   if (targetPostIndex === -1) return null;
  //   db.posts.splice(targetPostIndex, 1, {
  //     ...db.posts[targetPostIndex],
  //     ...post,
  //   });
  //   return db.posts[targetPostIndex];
  // },
  // deletePost: (id: string) => {
  //   const targetPostIndex = findIndexByIdHelper(id);
  //   if (targetPostIndex === -1) return null;
  //   return db.posts.splice(targetPostIndex, 1);
  // },
};
