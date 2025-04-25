import { body } from "express-validator";

const validateCode = body("code")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty");

export const confirmationCodeBodyValidators = [validateCode];
