import { body } from "express-validator";

const validateEmail = body("email")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Must be an email");

export const resendEmailBodyValidators = [validateEmail];
