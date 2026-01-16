import HttpException from "./HttpException";

class InvalidTokenException extends HttpException {
  constructor(message = "Token is invalid") {
    super(message, 400);
  }
}

export default InvalidTokenException;
