import HttpException from "./HttpException";

class AuthException extends HttpException {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export default AuthException;
