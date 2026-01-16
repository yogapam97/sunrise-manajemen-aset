import type { Request, Response, NextFunction } from "express";

import HttpException from "../exceptions/HttpException";
import WorkspaceService from "../services/WorkspaceService";
import WorkspaceException from "../exceptions/WorkspaceException";

// Extend Express's Request object with a 'user' property
declare global {
  namespace Express {
    interface Request {
      workspace?: {
        id: string;
        [key: string]: any; // optional: for additional properties
      };
      workspace_member: {
        id: string;
        [key: string]: any; // optional: for additional properties
      };
    }
  }
}

const memberMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let workspaceId = req.headers["x-workspace-id"];

  if (Array.isArray(workspaceId)) {
    workspaceId = workspaceId[0];
  }

  const email = req.user?.email as string;

  if (workspaceId) {
    try {
      const member = await WorkspaceService.getMemberByEmail(workspaceId, email);
      if (!member) {
        next(new HttpException());
      } else {
        next();
      }
    } catch (e) {
      if (e instanceof HttpException) {
        next(new HttpException(e.message, e.status));
      } else {
        next(new HttpException());
      }
    }
  } else {
    next(new WorkspaceException());
  }
};

export default memberMiddleware;
