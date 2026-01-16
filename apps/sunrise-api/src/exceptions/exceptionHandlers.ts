import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import HttpException from "./HttpException";

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof HttpException) {
    return res.status(err.status).json(err.toJSON());
  }
  if (err instanceof SyntaxError && "type" in err && (err as any).type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON", status: 400 });
  }
  return res.status(500).json({ message: err.message || "Something went wrong", status: 500 });
};

export default errorHandler;
