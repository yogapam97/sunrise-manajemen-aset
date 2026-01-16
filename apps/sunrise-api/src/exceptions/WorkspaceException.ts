import HttpException from "./HttpException";

class WorkspaceException extends HttpException {
  constructor(message = "Invalid Workspace") {
    super(message, 400);
  }
}

export default WorkspaceException;
