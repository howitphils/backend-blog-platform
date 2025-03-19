import { body } from "express-validator";

export const validateTitle = body("title")
  .isString()
  .withMessage("Should be a string")
  .trim()
  .notEmpty()
  .withMessage("Should not be empty")
  .isLength({ max: 30 })
  .withMessage("Length is more than 30 symbols");

const validateShortDescription = body("shortDescription")
  .isString()
  .withMessage("Should be a string")
  .trim()
  .notEmpty()
  .withMessage("Should not be empty")
  .isLength({ max: 100 })
  .withMessage("Length is more than 100 symbols");

const validateContent = body("content")
  .isString()
  .withMessage("Should be a string")
  .trim()
  .notEmpty()
  .withMessage("Should not be empty")
  .isLength({ max: 1000 })
  .withMessage("Length is more than 1000 symbols");

// const validateBlogId = body("blogId")
//   .isString()
//   .withMessage("Should be a string")
//   .notEmpty()
//   .withMessage("Should not be empty");
// // .custom(async (blogId: string) => {
// //   const convertedId = new ObjectId(blogId);
// //   const targetBlog = await blogsRepository.getBlogById(convertedId);
// //   if (!targetBlog) {
// //     throw new Error("Blog does not exist");
// //   }
// //   return true;
// // });

export const postsBodyValidator = [
  validateTitle,
  validateShortDescription,
  validateContent,
  // validateBlogId,
];
