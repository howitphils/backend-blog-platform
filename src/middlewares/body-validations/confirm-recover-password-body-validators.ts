import { body } from "express-validator";

const validateNewPassword = body("newPassword")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty")
  .isLength({ max: 20, min: 6 })
  .withMessage("Length must be between 6 and 20 symbols");

const validateRecoveryCode = body("recoveryCode")
  .isString()
  .withMessage("Must be a string")
  .trim()
  .notEmpty()
  .withMessage("Must not be empty");

export const confrimPasswordRecoveryValidators = [
  validateNewPassword,
  validateRecoveryCode,
];
