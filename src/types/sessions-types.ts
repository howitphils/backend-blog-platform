export type SessionDbType = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
  ip: string;
  device_name: string;
};

export type SessionTestType = {
  userId?: string;
  deviceId?: string;
  iat?: number;
  exp?: number;
  ip?: string;
  device_name?: string;
};

export type SessionViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
