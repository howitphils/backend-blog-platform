export enum ResultStatus {
  Success = "Success",
  NotFound = "NotFound",
  Forbidden = "Forbidden",
  Unauthorized = "Unauthorized",
  BadRequest = "BadRequest",
  ServerError = "ServerError",
}

export type ExtensionType = {
  field: string | null;
  message: string;
};

export type ResultObject<T = null> = {
  status: keyof typeof ResultStatus;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};
