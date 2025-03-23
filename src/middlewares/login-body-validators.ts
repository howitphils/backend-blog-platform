import { body } from "express-validator";

export const validateLoginOrEmail = body("loginOrEmail")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty");

const validatePassword = body("password")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty");

export const loginBodyValidators = [validateLoginOrEmail, validatePassword];
