export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type LoginDto = {
  loginOrEmail?: string;
  password?: string;
};

export type TokenPairType = {
  accessToken: string;
  refreshToken: string;
};
