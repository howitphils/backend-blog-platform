import { BlogInputModel } from "./blogs-types";
import { PostInputModel } from "./posts-types";

export type ErrorMessageType = {
  message: string;
  field: string;
};

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel;

export type OutputErrorsType = {
  errorsMessages: ErrorMessageType[];
};
