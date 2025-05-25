export class Session {
  userId: string;
  deviceId: string;
  iat: Date;
  exp: Date;
  ip: string;
  device_name: string;

  constructor(
    userId: string,
    deviceId: string,
    iat: Date,
    exp: Date,
    ip: string,
    deviceName: string
  ) {
    (this.userId = userId),
      (this.deviceId = deviceId),
      (this.iat = iat),
      (this.exp = exp),
      (this.ip = ip),
      (this.device_name = deviceName);
  }
}
