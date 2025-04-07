import { body } from "express-validator";

const validateContent = body("content")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty")
  .isLength({ max: 300, min: 20 })
  .withMessage("Length must be between 20 and 300 symbols");

export const commentsBodyValidators = [validateContent];
