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

// export class User {
//   accountData: {
//     login: string;
//     email: string;
//     passHash: string;
//     createdAt: string;
//   };
//   emailConfirmation: {
//     confirmationCode: string;
//     expirationDate: Date;
//     isConfirmed: boolean;
//   };
//   passwordRecovery: {
//     recoveryCode: string;
//     expirationDate: Date;
//   };

//   constructor(
//     email: string,
//     login: string,
//     passHash: string,
//     isAdmin?: boolean
//   ) {
//     this.accountData = {
//       email,
//       login,
//       passHash,
//       createdAt: new Date().toISOString(),
//     };
//     this.emailConfirmation = {
//       confirmationCode: uuIdService.createRandomCode(),
//       expirationDate: dateFnsService.addToCurrentDate(),
//       isConfirmed: isAdmin ? true : false,
//     };
//     this.passwordRecovery = {
//       recoveryCode: uuIdService.createRandomCode(),
//       expirationDate: dateFnsService.addToCurrentDate(),
//     };
//   }
// }
