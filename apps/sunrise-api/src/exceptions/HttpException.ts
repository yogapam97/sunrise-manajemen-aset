class HttpException extends Error {
  status: number;

  constructor(message = "An error occurred", status = 500) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
    };
  }
}

export default HttpException;
