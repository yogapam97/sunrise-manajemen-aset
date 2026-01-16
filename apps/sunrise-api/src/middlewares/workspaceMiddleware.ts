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
      member: {
        id: string;
        [key: string]: any; // optional: for additional properties
      };
    }
  }
}

const workspaceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let workspaceId = req.headers["x-workspace-id"];

  if (Array.isArray(workspaceId)) {
    workspaceId = workspaceId[0];
  }

  if (workspaceId) {
    try {
      const workspace: any = await WorkspaceService.getById(workspaceId);
      req.workspace = workspace;
      const member: any = await WorkspaceService.getMemberByEmail(
        workspaceId,
        req?.user?.email || ""
      );
      req.member = member;
      next();
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

export default workspaceMiddleware;
