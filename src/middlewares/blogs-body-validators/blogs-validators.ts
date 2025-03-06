import { body } from "express-validator";

export const validateName = body("name")
  .isString()
  .withMessage("Should be a string")
  .trim()
  .notEmpty()
  .withMessage("Should not be empty")
  .isLength({ max: 15 })
  .withMessage("Length is more than 15 symbols");

const validateDescription = body("description")
  .isString()
  .withMessage("Should be a string")
  .trim()
  .notEmpty()
  .withMessage("Should not be empty")
  .isLength({ max: 500 })
  .withMessage("Length is more than 500 symbols");

const validateWebsiteUrl = body("websiteUrl")
  .trim()
  .notEmpty()
  .withMessage("Should not be empty")
  .isLength({ max: 100 })
  .withMessage("Length is more than 100 symbols")
  .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
  .withMessage("Should be an url");

export const blogsBodyValidator = [
  validateName,
  validateDescription,
  validateWebsiteUrl,
];
