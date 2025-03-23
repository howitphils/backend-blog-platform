import { body } from "express-validator";

export const validateLogin = body("login")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty")
  .isLength({ max: 10, min: 3 })
  .withMessage("Length must be between 3 and 10 symbols")
  .matches("^[a-zA-Z0-9_-]*$")
  .withMessage("Contains incorrect symbols");

const validatePassword = body("password")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty")
  .isLength({ max: 20, min: 6 })
  .withMessage("Length must be between 6 and 20 symbols");

const validateEmail = body("email")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty")
  .matches("^[w-.]+@([w-]+.)+[w-]{2,4}$")
  .withMessage("Must be an email");

export const userBodyValidators = [
  validateLogin,
  validatePassword,
  validateEmail,
];
