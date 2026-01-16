import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import AuthException from "../exceptions/AuthException";

// Extend Express's Request object with a 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// This middleware verifies the JWT
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const SECRET_KEY: string = process.env.AUTH_JWT_SECRET || ""; // Replace with your own secret key
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract the token from the Bearer string

    jwt.verify(token as string, SECRET_KEY, { algorithms: ["HS256"] }, (err: any, user: any) => {
      if (err) {
        throw new AuthException();
      }

      // Attach user to request object
      req.user = user as JwtPayload;

      next();
    });
  } else {
    throw new AuthException();
  }
};

export default authMiddleware;
