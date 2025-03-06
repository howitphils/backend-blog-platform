import { body } from "express-validator";
import { blogsRepository } from "../../db/repositories/blogs-repository";

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

const validateBlogId = body("blogId")
  .isString()
  .withMessage("Should be a string")
  .notEmpty()
  .withMessage("Should not be empty")
  .custom((blogId: string) => {
    const targetBlog = blogsRepository.getBlogById(blogId);
    if (!targetBlog) {
      throw new Error("Blog does not exist");
    }
    return true;
  });

export const postsBodyValidator = [
  validateTitle,
  validateShortDescription,
  validateContent,
  validateBlogId,
];
