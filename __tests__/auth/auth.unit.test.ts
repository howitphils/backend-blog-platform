import { jwtService } from "./../../src/adapters/jwtService";
import { authService } from "./../../src/services/auth-service";
import { ResultStatus } from "../../src/types/resultObject-types";

describe("/unit tests for check access token", () => {
  const checkAccessTokenUseCase = authService.checkAccessToken;
  it("should return an error if auth type is not Bearer", () => {
    const res = checkAccessTokenUseCase("Basic asdad");

    expect(res.status).toBe(ResultStatus.Unauthorized);
    expect(res.errorMessage).toBe("Wrong auth type");
  });

  it("should return an error if token is not verified", () => {
    const res = checkAccessTokenUseCase("Bearer asdasd");

    expect(res.status).toBe(ResultStatus.Unauthorized);
    expect(res.errorMessage).toBe("Token is not verified");
  });

  it("should return an error if token is not verified", () => {
    jwtService.verifyToken = jest.fn().mockReturnValue({ userId: 1 });

    const res = checkAccessTokenUseCase("Bearer asdasd");

    expect(res.status).toBe(ResultStatus.Success);
    expect(res.data).toBe(1);
  });
});
