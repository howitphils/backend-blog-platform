export enum ResultStatus {
  Success = "Success",
  NoContent = "NoContent",
  NotFound = "NotFound",
  Forbidden = "Forbidden",
  Unauthorized = "Unauthorized",
  BadRequest = "BadRequest",
  ServerError = "ServerError",
}

type ExtensionType = {
  field: string | null;
  message: string;
};

export type ResultObject<T = null> = {
  status: keyof typeof ResultStatus;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};
