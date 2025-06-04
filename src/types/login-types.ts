export type UserInfoType = {
  usersCredentials: {
    loginOrEmail: string;
    password: string;
  };
  usersConfigs: {
    device_name: string;
    ip: string;
  };
};

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
