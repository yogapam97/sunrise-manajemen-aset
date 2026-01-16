import HttpException from "./HttpException";

class DataNotFoundException extends HttpException {
  constructor(message = "Data Not Found") {
    super(message, 400); // 404 Not Found
  }
}

export default DataNotFoundException;
